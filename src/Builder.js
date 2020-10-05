import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { validate } from './validations.js'

const Builder = () => {
  const MAX_CHARACTER_LIMIT = 10
  const [field, setField] = useState({
    label: '',
    default: '',
    choices: '',
    displayAlpha: false,
    multiSelect: false,
    required: false
  })
  const [onChangeNotifications, setOnChangeNotifications] = useState({
    defaultCharacterMax: `${MAX_CHARACTER_LIMIT} character maximum`,
    maxExceeded: false
  })
  const [notifications, setNotifications] = useState({
    duplicatesError: '',
    choicesError: '',
    lengthError: ''
  })
  const [created, setCreated] = useState('')

  // Turn choices string into an array
  const normalizeChoices = (choices, displayAlpha) => {
    let choicesArray = choices.split('\n')

    choicesArray = choicesArray.map(x => x.trim())
    choicesArray = choicesArray.filter(element => element !== '')

    if (displayAlpha) {
      choicesArray.sort()
    }
    return choicesArray
  }

  // Add defaultChoice value if not already included
  const addDefaultIfNeeded = (defaultChoice, choicesArray) => {
    const defaultLowerCase = defaultChoice.toLowerCase().trim()

    const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())

    if (!defaultLowerCase === '' && !choicesArrayLowerCase.includes(defaultLowerCase)) {
      choicesArray.unshift(defaultChoice.trim())
    }
    return choicesArray
  }

  // Updates field state to reflect changes in text areas
  const handleChange = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: event.target.value }))

    // Characters remaining
    const choiceLength = event.target.value.length
    const isDefault = event.target.name === 'default'
    const charactersRemaining = MAX_CHARACTER_LIMIT - choiceLength

    if (!isDefault) {
      return
    }

    // Default Choice Length Validation
    let notification
    if (!choiceLength) {
      notification = `${MAX_CHARACTER_LIMIT} character maximum`
    } else if (charactersRemaining >= 0) {
      if (charactersRemaining === 1) {
        notification = `${charactersRemaining} character left`
      } else {
        notification = `${charactersRemaining} characters left`
      }
    } else if (charactersRemaining < 0) {
      // add code to change color of the notification
      if (Math.abs(charactersRemaining) === 1) {
        notification = `${Math.abs(charactersRemaining)} character past maximum`
      } else {
        notification = `${Math.abs(charactersRemaining)} characters past maximum`
      }
    }
    onChangeNotifications.defaultCharacterMax = notification
  }

  // Check box handling
  const handleCheck = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: !field[event.target.name] }))
  }

  const handleSubmit = event => {
    event.preventDefault()

    let choicesArray = normalizeChoices(field.choices, field.displayAlpha)
    choicesArray = addDefaultIfNeeded(field.default, choicesArray)
    const errors = validate(choicesArray, MAX_CHARACTER_LIMIT)

    const choicesString = choicesArray.join('\n')

    setField({ ...field, choices: choicesString })
    setNotifications({ ...errors })
    setCreated('')
    if (Object.values(errors).every(x => x === '')) {
      submit()
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

    setOnChangeNotifications({
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
                  {onChangeNotifications.defaultCharacterMax}
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
                  {`10 character maximum per choice ${onChangeNotifications.choicesCharacterMax}`}
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
