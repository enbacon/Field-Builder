const MAX_CHOICES = 4

// Export function to allow it to be used in Builder.js
// Making this custom validation reusable

export function validate (choicesArray, maxCharacterLength) {
  // When validate is called, clear errors to avoid false notifications
  const errors = { duplicatesError: '', choicesError: '', lengthError: '' }

  const duplicates = findDuplicates(choicesArray)
  if (duplicates.length !== 0) {
    errors.duplicatesError = `* Duplicate choices are not allowed. Please remove the following duplicates: ${duplicates.join(', ')}`
  }

  if (choicesArray.length > MAX_CHOICES) {
    errors.choicesError = `* You have entered ${choicesArray.length} choices (maximum of ${MAX_CHOICES} allowed). Please delete ${choicesArray.length - MAX_CHOICES} before saving. Note: Default Choice should not be deleted.`
    // indexOf default choice
    // if -1 additional notification, default choice may not be deleted
  }

  const longWords = findLongChoices(choicesArray, maxCharacterLength)
  if (longWords.length !== 0) {
    errors.lengthError = `* The following choices exceed the ${maxCharacterLength} character maximum: ${longWords.join(', ')}`
  }
  return errors
}

// Find duplicate entries
function findDuplicates (choicesArray) {
  const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())

  const duplicates = choicesArrayLowerCase.reduce(function (acc, curr, index, srcArr) {
    if (srcArr.indexOf(curr) !== index && acc.indexOf(curr) < 0) acc.push(curr)
    return acc
  }, [])
  return duplicates
}

// Find choices that exceed the MAX_CHARACTER_LIMIT
function findLongChoices (choicesArray, maxCharacterLength) {
  const longWords = choicesArray.filter(choice => choice.length > maxCharacterLength)
  return longWords
}
