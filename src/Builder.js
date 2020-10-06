import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { validate } from './validations.js'

const Builder = () => {
  const MAX_CHARACTER_LIMIT = 40

  const [field, setField] = useState({
    label: '',
    default: '',
    choices: '',
    displayAlpha: false,
    multiSelect: false,
    required: false
  })
  const [defaultChoiceNotification, setDefaultChoiceNotification] = useState({
    defaultCharacterMax: `${MAX_CHARACTER_LIMIT} character maximum`
  })
  const [notifications, setNotifications] = useState({
    duplicatesError: '',
    choicesError: '',
    lengthError: ''
  })
  const [created, setCreated] = useState('')

  // Turn choices string into an array
  const normalizeChoices = (choices) => {
    let choicesArray = choices.split('\n')

    choicesArray = choicesArray.map(x => x.trim())
    choicesArray = choicesArray.filter(element => element !== '')

    return choicesArray
  }

  // Add defaultChoice value if not already included
  const addDefaultIfNeeded = (defaultChoice, choicesArray) => {
    if (!defaultChoice) {
      return choicesArray
    }

    const defaultLowerCase = defaultChoice.toLowerCase().trim()

    notifyDefaultChoiceLength(defaultLowerCase, MAX_CHARACTER_LIMIT)

    const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())

    if (!choicesArrayLowerCase.includes(defaultLowerCase)) {
      choicesArray.unshift(defaultChoice.trim())
    }
    return choicesArray
  }

  // Determine Default Choice length
  const notifyDefaultChoiceLength = (defaultChoice, maxCharacterLength) => {
    const choiceLength = defaultChoice.length
    const characterDifference = maxCharacterLength - choiceLength

    let notification
    if (!choiceLength) {
      notification = `${MAX_CHARACTER_LIMIT} character maximum`
    } else if (characterDifference >= 0) {
      if (characterDifference === 1) {
        notification = `${characterDifference} character left`
      } else {
        notification = `${characterDifference} characters left`
      }
    } else if (characterDifference < 0) {
      if (Math.abs(characterDifference) === 1) {
        notification = `${Math.abs(characterDifference)} character past maximum`
      } else {
        notification = `${Math.abs(characterDifference)} characters past maximum`
      }
    }
    setDefaultChoiceNotification({ defaultCharacterMax: notification })
  }

  // Updates field state to reflect changes in text areas
  const handleChange = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: event.target.value }))

    // Characters remaining/countdown for Default Choice ONLY
    const isDefault = event.target.name === 'default'
    const defaultChoice = event.target.value

    if (!isDefault) {
    } else {
      notifyDefaultChoiceLength(defaultChoice, MAX_CHARACTER_LIMIT)
    }
  }

  // Check box handling
  const handleCheck = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: !field[event.target.name] }))
  }

  // If Default Choice exceeds character limit
  // remove it from choicesArray
  // This is called after validations to prevent
  const removeInvalidDefaultChoice = (defaultChoice, choicesArray) => {
    if (defaultChoice.length > MAX_CHARACTER_LIMIT) {
      choicesArray = choicesArray.filter(element => (element !== defaultChoice))
    }
    return choicesArray
  }

  // Alphabetize Choices
  const alphabetize = (choicesArray, displayAlpha) => {
    if (displayAlpha) {
      choicesArray = choicesArray.sort()
      return choicesArray
    }
    return choicesArray
  }

  // Move Default Choice to first choice unless Choices are alphabetized
  const prioritizeDefaultChoice = (defaultChoice, choicesArray, displayAlpha) => {
    if (displayAlpha) {
      return choicesArray
    }

    if (choicesArray.indexOf(defaultChoice) <= 0) {
      return choicesArray
    }
    choicesArray = choicesArray.filter(element => (element !== defaultChoice))
    choicesArray = [defaultChoice, ...choicesArray]
    return choicesArray
  }

  const handleSubmit = event => {
    event.preventDefault()
    let choicesArray = normalizeChoices(field.choices, field.displayAlpha)
    choicesArray = addDefaultIfNeeded(field.default, choicesArray)
    const errors = validate(choicesArray, MAX_CHARACTER_LIMIT)
    choicesArray = removeInvalidDefaultChoice(field.default, choicesArray, MAX_CHARACTER_LIMIT)
    choicesArray = alphabetize(choicesArray, field.displayAlpha)
    choicesArray = prioritizeDefaultChoice(field.default, choicesArray, field.displayAlpha)
    const choicesString = choicesArray.join('\n')

    setField({ ...field, default: field.default.trim(), choices: choicesString })
    setNotifications({ ...errors })
    setCreated('')
    if (Object.values(errors).every(x => x === '')) {
      submit(choicesArray)
    }
  }

  const submit = (choicesArray) => {
    const data = {
      label: field.label,
      default: field.default,
      choices: choicesArray,
      displayAlpha: field.displayAlpha,
      multiSelect: field.multiSelect,
      required: field.required
    }

    axios({
      method: 'POST',
      url: 'http://www.mocky.io/v2/566061f21200008e3aabd919',
      data: data
    })

      .then(() => setCreated('Congratulations! Field built successfully!'))
      .catch(console.error)

    console.log('Field data', data)
  }

  const resetState = () => {
    setField({
      label: '',
      default: '',
      choices: '',
      displayAlpha: false,
      multiSelect: false,
      required: false
    })

    setDefaultChoiceNotification({
      defaultCharacterMax: `${MAX_CHARACTER_LIMIT} character maximum`
    })

    setNotifications({
      duplicatesError: '',
      choicesError: '',
      lengthError: ''
    })

    setCreated('')
  }

  const handleReset = event => {
    event.preventDefault()
    resetState()
  }

  return (
    <div>
      <Container className="container">
        <div className="form-field">
          <h1 id="form-name">Field Builder</h1>

          <Form className="form" onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="label">
              <Col md={4}>
                <Form.Label className="label">Label</Form.Label>
              </Col>

              <Col>
                <Form.Control
                  required
                  type="text"
                  name="label"
                  placeholder="Cake Flavors"
                  onChange={handleChange}
                  value={field.label}
                  md={7}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="default" className="small-entry">
              <Col md={4}>
                <Form.Label className="label">Default Choice</Form.Label>
              </Col>

              <Col>
                <Form.Control
                  type="text"
                  name="default"
                  placeholder="Red Velvet"
                  onChange={handleChange}
                  value={field.default}
                  md={7} />

                <div style={{ fontSize: 14, color: 'black' }}>
                  {defaultChoiceNotification.defaultCharacterMax}
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="choices">
              <Col md={4}>
                <Form.Label className="label">Choices</Form.Label>
              </Col>

              <Col>
                <Form.Control
                  as="textarea"
                  className="text-area"
                  name="choices"
                  placeholder="Add Choices"
                  onChange={handleChange}
                  value={field.choices}
                  md={7} />

                <div style={{ fontSize: 14, color: 'black' }}>
                  10 character maximum per choice
                </div>

                <div style={{ fontSize: 14, color: 'red', marginLeft: '2px' }}>
                  {notifications.duplicatesError}
                </div>

                <div style={{ fontSize: 14, color: 'red' }}>
                  {notifications.choicesError}
                </div>
                <div style={{ fontSize: 14, color: 'red' }}>
                  {notifications.lengthError}
                </div>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col md={4}>
              </Col>

              <Col>
                <Form.Check
                  type="checkbox"
                  name="displayAlpha"
                  onChange={handleCheck}
                  checked={field.displayAlpha}
                  label="Display Alphabetically" />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col md={4}>
              </Col>

              <Col>
                <Form.Check
                  type="checkbox"
                  name="multiSelect"
                  onChange={handleCheck}
                  checked={field.multiSelect}
                  label="Select Multiple Choices" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="required">
              <Col md={4}>
              </Col>

              <Col>
                <Form.Check
                  type="checkbox"
                  name="required"
                  onChange={handleCheck}
                  checked={field.required}
                  label="Required Field"
                  value={field.required} />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col md={4}>
              </Col>

              <Col md={4}>
                <Button
                  className="save"
                  variant="success"
                  type="submit">
                  Save Changes
                </Button>
              </Col>

              <Col md={4}>
                <Button
                  className="reset"
                  variant="outline-danger"
                  type="button"
                  onClick={handleReset}>
                  Reset Form
                </Button>
              </Col>

            </Form.Group>
            <div style={{ fontSize: 18, color: 'green' }}>
              {created}
            </div>

          </Form>
        </div>
      </Container>
    </div>
  )
}

export default Builder
