const MAX_CHOICES = 50

// Export function to allow it to be used in Builder.js
// Makes this custom validation reusable
export function validate (choicesArray, maxCharacterLength) {
  // When validate is called, clear errors to avoid false notifications
  const errors = { duplicatesError: '', choicesError: '', lengthError: '' }

  // Duplicates check
  const duplicates = findDuplicates(choicesArray)
  if (duplicates.length !== 0) {
    errors.duplicatesError = `* Duplicate choices are not allowed. Please remove the following duplicates: ${duplicates.join(', ')}`
  }

  // Choice Limit check
  if (choicesArray.length > MAX_CHOICES) {
    errors.choicesError = `* You have entered ${choicesArray.length} choices (maximum of ${MAX_CHOICES} allowed). Please delete ${choicesArray.length - MAX_CHOICES} before saving. Note: Default Choice should not be deleted.`
  }

  // Character Limit check
  const longWords = findLongChoices(choicesArray, maxCharacterLength)
  if (longWords.length !== 0) {
    errors.lengthError = `* The following choices exceed the ${maxCharacterLength} character maximum: ${longWords.join(', ')}`
  }
  return errors
}

// Find duplicate entries
// Return duplicate choices
function findDuplicates (choicesArray) {
  const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())

  const duplicates = choicesArrayLowerCase.reduce(function (acc, curr, index, srcArr) {
    if (srcArr.indexOf(curr) !== index && acc.indexOf(curr) < 0) acc.push(curr)
    return acc
  }, [])
  return duplicates
}

// Find choices that exceed the MAX_CHARACTER_LIMIT
// Return choices that are too long
function findLongChoices (choicesArray, maxCharacterLength) {
  const longWords = choicesArray.filter(choice => choice.length > maxCharacterLength)
  return longWords
}
