export const MAX_FORM_FILES = 10;
export const MAX_FORM_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_FORM_TOTAL_BYTES = 28 * 1024 * 1024;

export const FORM_FILE_LIMIT_LABEL = 'Fino a 10 file, massimo 10 MB ciascuno e 28 MB totali.';

export const selectFormFiles = (currentFiles = [], fileList = []) => {
  const selected = Array.from(fileList || []);
  const nextFiles = [...currentFiles, ...selected];

  if (nextFiles.length > MAX_FORM_FILES) {
    return { files: currentFiles, error: `Puoi allegare al massimo ${MAX_FORM_FILES} file.` };
  }

  const oversized = selected.find((file) => Number(file?.size || 0) > MAX_FORM_FILE_BYTES);
  if (oversized) {
    return { files: currentFiles, error: `Il file “${oversized.name}” supera il limite di 10 MB.` };
  }

  const totalBytes = nextFiles.reduce((total, file) => total + Number(file?.size || 0), 0);
  if (totalBytes > MAX_FORM_TOTAL_BYTES) {
    return { files: currentFiles, error: 'Gli allegati superano il limite complessivo di 28 MB.' };
  }

  return { files: nextFiles, error: null };
};
