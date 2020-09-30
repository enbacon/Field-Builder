import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { validate } from './validations.js'

const Builder = () => {
  const MAX_CHARACTER_LENGTH = 5
  const [field, setField] = useState({
    label: '',
    default: '',
    choices: '',
    displayAlpha: false,
    multiSelect: false,
    required: false
  })
  const [characterNotification, setCharacterNotification] = useState({
    charactersRemaining: `${MAX_CHARACTER_LENGTH} characters left`
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
    if (event.target.name === 'default' && event.target.value.length >= 0) {
      const choiceLength = event.target.value.length
      characterNotification.charactersRemaining = `${MAX_CHARACTER_LENGTH - choiceLength} characters left`
      console.log((MAX_CHARACTER_LENGTH - choiceLength) + ' characters left')
    }

    // console.log(`your entry is too long`)
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

    axios({
      method: 'POST',
      url: 'http://www.mocky.io/v2/566061f21200008e3aabd919',
      data: data
    })
      .then(() => setCreated('Congratulations! Field built successfully !'))
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

    setCharacterNotification({
      charactersRemaining: MAX_CHARACTER_LENGTH + ' characters left'
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
                  autoComplete="off"
                  onChange={handleChange}
                  value={field.label}
                  md={7}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="default" className="small-entry">
              <Col md={4}>
                <Form.Label className="label">Default Value</Form.Label>
              </Col>

              <Col>
                <Form.Control
                  type="text"
                  name="default"
                  placeholder="Red Velvet"
                  autoComplete="off"
                  maxLength={MAX_CHARACTER_LENGTH}
                  onChange={handleChange}
                  value={field.default}
                  md={7} />

                <div style={{ fontSize: 14, color: 'black' }}>
                  {characterNotification.charactersRemaining}
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
                  autoComplete="off"
                  onChange={handleChange}
                  value={field.choices}
                  md={7} />

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
