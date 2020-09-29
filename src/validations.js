const MAX_CHOICES = 5

// Export function to allow it to be used in Builder.js
// Making this custom validation reusable

export function validate (choicesArray) {
  // When validate is called, clear errors to avoid false notifications
  const errors = { duplicatesError: '', choicesError: '' }

  const duplicates = findDuplicates(choicesArray)
  if (duplicates.length !== 0) {
    errors.duplicatesError = `Duplicate choices are not allowed. Please remove the following duplicates: ${duplicates.join(', ')}`
  }

  if (choicesArray.length > MAX_CHOICES) {
    errors.choicesError = `You have entered ${choicesArray.length} choices (maximum of ${MAX_CHOICES}). Please delete ${choicesArray.length - MAX_CHOICES} before saving.`
  }
  return errors
}

// Find duplicate entries
export function findDuplicates (choicesArray) {
  const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())

  const duplicates = choicesArrayLowerCase.reduce(function (acc, curr, index, srcArr) {
    if (srcArr.indexOf(curr) !== index && acc.indexOf(curr) < 0) acc.push(curr)
    return acc
  }, [])
  return duplicates
}

// Check choices character length
