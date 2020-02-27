import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const Builder = () => {
  const [field, setField] = useState({
    label: '',
    default: '',
    choices: '',
    displayAlpha: false,
    multiSelect: false,
    required: false,
    choicesError: ''
  })

  let choiceArray = []
  const choicesLogic = () => {
    // Create array with unique entries/choices
    // Add default value
    // Eliminate blank lines
    choiceArray = [...new Set(field.choices.split('\n')).add(field.default)].filter(element => (element !== ''))
    console.log('this is choiceArray', choiceArray)
  }

  const handleChange = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: event.target.value }))
  }

  const handleCheck = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: !field[event.target.name] }))
  }

  const validate = () => {
    let choicesError = ''
    // Change from 5 to 50 before submission
    // Currently using 5 for purposes of testing
    if (choiceArray.length > 5) {
      choicesError = 'Sorry, too many choices entered. Maximum of 50 including the default value. Please delete a choice before saving.'
    }
    if (choicesError) {
      setField({ ...field, choicesError })
      return false
    }
    return true
  }

  const handleSubmit = event => {
    event.preventDefault()
    choicesLogic()
    // Check validity, if form valid, submit and reset valid state
    const isValid = validate()
    if (isValid) {
      // Clear choicesError state upon successful submission
      setField({ ...field, choicesError: '' })
    }
    console.log('submit field values', field)
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
                <div style={{ fontSize: 14, color: 'red' }}>{field.choicesError}</div>
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
                <Button className="save" variant="success" type="submit">Save Changes</Button>
              </Col>
              <Col md={4}>
                <Button className="reset" variant="outline-danger" type="submit">Reset Form</Button>
              </Col>
            </Form.Group>
          </Form>
        </div>
      </Container>
    </div>
  )
}

export default Builder
