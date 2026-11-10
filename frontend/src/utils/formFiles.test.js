import {
  MAX_FORM_FILE_BYTES,
  MAX_FORM_FILES,
  MAX_FORM_TOTAL_BYTES,
  selectFormFiles,
} from './formFiles';

const file = (name, size) => ({ name, size });

test('accepts files within all limits', () => {
  const result = selectFormFiles([file('a.jpg', 100)], [file('b.pdf', 200)]);
  expect(result.error).toBeNull();
  expect(result.files).toHaveLength(2);
});

test('rejects count, single-file and total-size overflows without losing prior files', () => {
  const current = [file('kept.jpg', 100)];
  expect(selectFormFiles(current, Array.from({ length: MAX_FORM_FILES }, (_, index) => file(`${index}.jpg`, 1))).files).toBe(current);
  expect(selectFormFiles(current, [file('large.zip', MAX_FORM_FILE_BYTES + 1)]).files).toBe(current);
  expect(selectFormFiles(current, [file('total.zip', MAX_FORM_TOTAL_BYTES)]).files).toBe(current);
});
