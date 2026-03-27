import Marquee from 'react-fast-marquee';
import { Certificate, ShieldCheck, Medal, Buildings } from '@phosphor-icons/react';

const trustItems = [
  { icon: Certificate, text: 'ISO 9001 Certificato' },
  { icon: ShieldCheck, text: 'Distributore Esclusivo MADICO USA' },
  { icon: Medal, text: 'Garanzia 10 Anni' },
  { icon: Buildings, text: '45.000+ Edifici Trattati' },
  { icon: Certificate, text: 'Certificazione UNI EN 12600' },
  { icon: ShieldCheck, text: 'Conformità D.Lgs. 81/2008' },
];

const TrustBar = () => {
  return (
    <section className="trust-bar overflow-hidden" data-testid="trust-bar">
      <Marquee speed={40} gradient={false} pauseOnHover>
        {trustItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 mx-12"
          >
            <item.icon size={20} weight="bold" className="text-[#002FA7]" />
            <span className="text-sm font-medium uppercase tracking-wider whitespace-nowrap">
              {item.text}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default TrustBar;
