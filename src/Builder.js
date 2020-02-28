import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

const Builder = () => {
  const MAX_CHOICES = 50

  const [field, setField] = useState({
    label: '',
    default: '',
    choices: '',
    displayAlpha: false,
    multiSelect: false,
    required: false
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

    if (!choicesArray.includes(defaultChoice)) {
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
  }

  // Check box handling
  const handleCheck = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: !field[event.target.name] }))
  }

  // Find duplicate entries
  const findDuplicates = (choicesArray) => {
    const duplicates = choicesArray.reduce(function (acc, curr, index, srcArr) {
      if (srcArr.indexOf(curr) !== index && acc.indexOf(curr) < 0) acc.push(curr)
      return acc
    }, [])
    return duplicates
  }

  const validate = (choicesArray) => {
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
      .then(() => setCreated('Congratulations! Form successfully built!'))
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
          <h2>Field Builder</h2>

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
                <Form.Label className="label">Default Value</Form.Label>
              </Col>

              <Col>
                <Form.Control
                  type="text"
                  name="default"
                  placeholder="Red Velvet"
                  onChange={handleChange}
                  value={field.default}
                  md={7} />
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
