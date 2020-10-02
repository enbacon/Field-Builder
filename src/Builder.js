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
  const [characterNotification, setCharacterNotification] = useState({
    defaultCharactersRemaining: `${MAX_CHARACTER_LIMIT} character maximum`,
    choicesCharactersRemaining: `${MAX_CHARACTER_LIMIT} character maximum per choice`
  })
  const [notifications, setNotifications] = useState({
    duplicatesError: '',
    choicesError: ''
  })
  const [created, setCreated] = useState('')

  // Turn choices string into an array
  // Add defaultChoice value if not already included
  const normalizeChoices = (choices, defaultChoice, displayAlpha) => {
    let choicesArray = choices.split('\n')

    const choicesArrayLowerCase = choicesArray.map(choice => choice.toLowerCase())

    if (!choicesArrayLowerCase.includes(defaultChoice.toLowerCase())) {
      choicesArray.unshift(defaultChoice)
    }

    if (displayAlpha) {
      choicesArray.sort()
    }

    choicesArray = choicesArray.map(x => x.trim())
    choicesArray = choicesArray.filter(element => element !== '')
    return choicesArray
  }

  // Updates field state to reflect changes in text areas
  const handleChange = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: event.target.value }))

    // Characters remaining
    const choiceLength = event.target.value.length

    // Default Choice Length Validation
    if (event.target.name === 'default' && !event.target.value.length) {
      characterNotification.defaultCharactersRemaining = `${MAX_CHARACTER_LIMIT} character maximum`
    } else if (event.target.name === 'default' && (MAX_CHARACTER_LIMIT - choiceLength >= 0)) {
      characterNotification.defaultCharactersRemaining = `${MAX_CHARACTER_LIMIT - choiceLength} characters left`
      console.log('this is event.target.name', event.target.name)
      console.log(`${MAX_CHARACTER_LIMIT - choiceLength} characters left`)
    } else {
      if (event.target.name === 'default' && (MAX_CHARACTER_LIMIT - choiceLength < 0)) {
        if (Math.abs(MAX_CHARACTER_LIMIT - choiceLength) === 1) {
          characterNotification.defaultCharactersRemaining = `${Math.abs(MAX_CHARACTER_LIMIT - choiceLength)} character past maximum`
        } else {
          characterNotification.defaultCharactersRemaining = `${Math.abs(MAX_CHARACTER_LIMIT - choiceLength)} characters past maximum`
        }
      }
    }
  }

  // Check box handling
  const handleCheck = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: !field[event.target.name] }))
  }

  const handleSubmit = event => {
    event.preventDefault()

    const choicesArray = normalizeChoices(field.choices, field.default, field.displayAlpha)
    const choicesString = choicesArray.join('\n')
    const errors = validate(choicesArray)

    setField({ ...field, choices: choicesString })
    setNotifications({ ...errors })
    setCreated('')
    if (Object.values(errors).every(x => x === '')) {
      submit()
    }
  }

  const submit = () => {
    const data = {
      label: field.label,
      default: field.default,
      choices: normalizeChoices(field.choices, field.default, field.displayAlpha),
      displayAlpha: field.displayAlpha,
      multiSelect: field.multiSelect,
      required: field.required
    }

    // Start spinner code here
    axios({
      method: 'POST',
      url: 'http://www.mocky.io/v2/566061f21200008e3aabd919',
      data: data
    })

      .then(() => setCreated('Congratulations! Field built successfully!')
        // and stop spinner
      )
      .catch(console.error
        // and stop spinner
      )

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

    setCharacterNotification({
      defaultCharactersRemaining: `${MAX_CHARACTER_LIMIT} character maximum`,
      choicesCharactersRemaining: `${MAX_CHARACTER_LIMIT} character maximum per choice`
    })

    setNotifications({
      duplicatesError: '',
      choicesError: ''
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
                  {characterNotification.defaultCharactersRemaining}
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
                  {characterNotification.choicesCharactersRemaining}
                </div>

                <div style={{ fontSize: 14, color: 'red', marginLeft: '2px' }}>
                  {notifications.duplicatesError}
                </div>

                <div style={{ fontSize: 14, color: 'red' }}>
                  {notifications.choicesError}
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
