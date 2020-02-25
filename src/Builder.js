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
    choices:
      'Carrot Cake, Ice Cream Cake, Funfetti Cake',
    displayAlpha: true,
    multiSelect: false,
    required: false
  })

  const choicesLogic = () => {
    const formattedChoices = field.choices.split('\n')
    console.log('this is formatted choices', formattedChoices)
  }

  const handleSubmit = event => {
    event.preventDefault()
    console.log('this is fieldSaved', field)
  }

  const handleChange = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: event.target.value }))
  }

  const handleCheck = event => {
    event.persist()
    setField(field => ({ ...field, [event.target.name]: !field[event.target.name] }))
  }

  return (
    <div className="form">
      <Container>
        <Form onSubmit={handleSubmit}>
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
                md={7}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="default" className="small-entry">
            <Col md={4}>
              <Form.Label>Default Value</Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="text"
                name="default"
                placeholder="Red Velvet"
                onChange={handleChange}
                md={7} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="choices">
            <Col md={4}>
              <Form.Label>Choices</Form.Label>
            </Col>
            <Col>
              <Form.Control
                as="textarea"
                name="choices"
                placeholder="Add Choices"
                onChange={handleChange}
                md={7}
                rows="5" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="alphabetical">
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

          <Form.Group as={Row} controlId="multiSelect">
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
                label="Required Field" />
            </Col>
          </Form.Group>

          <Col>
            <Button variant="success" type="submit">Save Changes</Button>
          </Col>
          <Col>
            <p>Or</p>
          </Col>
          <Button variant="outline-danger btn-sm" type="submit">Reset Form</Button>
        </Form>
      </Container>

    </div>
  )
}

export default Builder
