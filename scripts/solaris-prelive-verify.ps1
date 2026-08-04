param(
  [string]$HostName = "www.solarisfilms.it",
  [string]$ApexHost = "solarisfilms.it",
  [string]$ResolveIp = "",
  [switch]$ExpectIndexable
)

$ErrorActionPreference = "Stop"

function Invoke-CurlText {
  param([string]$Url, [string]$HostForResolve = "")
  $args = @("-skL")
  if ($ResolveIp -and $HostForResolve) {
    $uri = [Uri]$Url
    $port = $uri.Port
    if ($port -eq -1) {
      if ($uri.Scheme -eq "https") {
        $port = 443
      } else {
        $port = 80
      }
    }
    $args += @("--resolve", "$($HostForResolve):$($port):$ResolveIp")
  }
  $args += $Url
  return (curl.exe @args) -join "`n"
}

function Invoke-CurlHead {
  param([string]$Url, [string]$HostForResolve = "", [int]$MaxRedirs = 0)
  $args = @("-sk", "--max-redirs", "$MaxRedirs", "-o", "NUL", "-w", "status=%{http_code};redirect=%{redirect_url}")
  if ($ResolveIp -and $HostForResolve) {
    $uri = [Uri]$Url
    $port = if ($uri.Port -eq -1) { if ($uri.Scheme -eq "https") { 443 } else { 80 } } else { $uri.Port }
    $args += @("--resolve", "$($HostForResolve):$($port):$ResolveIp")
  }
  $args += $Url
  return curl.exe @args
}

function Add-Check {
  param([System.Collections.Generic.List[object]]$Checks, [string]$Name, [bool]$Ok, [string]$Detail)
  $Checks.Add([pscustomobject]@{ name = $Name; ok = $Ok; detail = $Detail }) | Out-Null
}

$checks = [System.Collections.Generic.List[object]]::new()
$base = "https://$HostName"
$apex = "https://$ApexHost"

$wwwHome = Invoke-CurlHead "$base/" $HostName
$apexHome = Invoke-CurlHead "$apex/" $ApexHost
Add-Check $checks "www_home_200" ($wwwHome -match "status=200") $wwwHome
Add-Check $checks "apex_redirect_to_www" ($apexHome -match "status=301" -and $apexHome -match [regex]::Escape("$base/")) $apexHome

$robots = Invoke-CurlText "$base/robots.txt" $HostName
if ($ExpectIndexable) {
  Add-Check $checks "robots_indexable" ($robots -match "Allow:\s*/" -and $robots -notmatch "Disallow:\s*/") ($robots.Trim() -replace "\s+", " ")
} else {
  Add-Check $checks "robots_staging_noindex" ($robots -match "Disallow:\s*/") ($robots.Trim() -replace "\s+", " ")
}

$sitemap = Invoke-CurlText "$base/sitemap.xml" $HostName
$sitemapWwwCount = ([regex]::Matches($sitemap, [regex]::Escape("$base/"))).Count
$blockedTerms = ([regex]::Matches($sitemap, "lcd|fotocromatic|tecnosolar|zoho-callback|false-parent|llms-txt", "IgnoreCase")).Count
Add-Check $checks "sitemap_www_urls" ($sitemapWwwCount -gt 0) "www_urls=$sitemapWwwCount"
Add-Check $checks "sitemap_no_blocked_terms" ($blockedTerms -eq 0) "blocked_terms=$blockedTerms"

$criticalPaths = @(
  "/",
  "/prodotti/",
  "/prodotti/madico-sg-20-e-ps-sr/",
  "/pellicole-antisolari-sputtered/",
  "/pellicole-riflettenti/",
  "/pagina-info/garanzie/",
  "/certificato-di-sicurezza/",
  "/servizio-locale/pellicole-per-vetri-milano/",
  "/approfondimenti/pellicole-vetri-fake-news/"
)

foreach ($path in $criticalPaths) {
  $status = Invoke-CurlHead "$base$path" $HostName
  Add-Check $checks "critical_200:$path" ($status -match "status=200") $status
}

$redirectPaths = @{
  "/prodotti/tecnosolar-nt-20-e-ps-sr/" = "/prodotti/madico-sg-20-e-ps-sr/"
  "/prodotti/tecnosolar-ssn-50-te-sr/" = "/prodotti/madico-sg-20-e-ps-sr/"
}

foreach ($entry in $redirectPaths.GetEnumerator()) {
  $status = Invoke-CurlHead "$base$($entry.Key)" $HostName
  Add-Check $checks "redirect_301:$($entry.Key)" ($status -match "status=301" -and $status -match [regex]::Escape($entry.Value)) $status
}

$gonePaths = @(
  "/pellicole-per-vetri/pellicole-lcd-switch/",
  "/approfondimenti/guida-pellicola-lcd-switch-installazione/",
  "/approfondimenti/pellicole-fotocromatiche/",
  "/pellicole-per-vetri/llms-txt/"
)

foreach ($path in $gonePaths) {
  $status = Invoke-CurlHead "$base$path" $HostName
  Add-Check $checks "gone_410:$path" ($status -match "status=410") $status
}

$failed = @($checks | Where-Object { -not $_.ok })
$summary = [pscustomobject]@{
  host = $HostName
  apex = $ApexHost
  resolve_ip = $ResolveIp
  expect_indexable = [bool]$ExpectIndexable
  total = $checks.Count
  failed = $failed.Count
  checks = $checks
}

$summary | ConvertTo-Json -Depth 5
if ($failed.Count -gt 0) {
  exit 1
}
