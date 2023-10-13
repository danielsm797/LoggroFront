describe('app spec', () => {

  it('La página se puede abrir', () => {
    cy
      .visit('http://localhost:4200/')

    cy
      .contains('Restobares APP')
  })

  it('Renderiza el gráfico de imágenes procesadas por hora', () => {

    cy
      .visit('http://localhost:4200/')

    cy
      .get('#resume-panel')
      .contains('Consultar')
      .click()

    cy
      .get('apx-chart')
  })

  it('Selecciona la imágen con el formato .PNG', () => {

    cy
      .visit('http://localhost:4200/')

    cy
      .get('#main-panel')
      .find('input[type="file"]')
      .selectFile('./cypress/fixtures/testPNG.png');

    cy
      .get('#main-img-selected')

    cy
      .get('#txtFileName')
      .type('File example 01')

    cy
      .get('#txtUserName')
      .type('User example 01')

    cy
      .contains('Convertir')
      .click()

    cy
      .contains('Formato de la imagen inválido. Solo está permitido subir imágenes con formato jpg,jpeg')
  })

  it('Selecciona la imágen con el formato .JPG', () => {

    cy
      .visit('http://localhost:4200/')

    cy
      .get('#main-panel')
      .find('input[type="file"]')
      .selectFile('./cypress/fixtures/testJPG.jpg');

    cy
      .get('#main-img-selected')

    cy
      .get('#txtFileName')
      .type('File example 02')

    cy
      .get('#txtUserName')
      .type('User example 02')

    cy
      .contains('Convertir')
      .click()

    cy
      .contains('Imagen procesada y guardada exitosamente!')
  })

  it('Se han encontrado imágenes procesadas', () => {

    cy
      .visit('http://localhost:4200/')

    cy
      .get('#search-panel')
      .find('input[type="datetime-local"]:last')
      .type("2025-12-23T23:59")

    cy
      .get('#search-panel')
      .contains('Consultar')
      .click()

    cy
      .get('#search-panel')
      .get('#image-panel-result')
  })

  it('No diligenció correctamente el formulario', () => {

    cy
      .visit('http://localhost:4200/')

    cy
      .get('#main-panel')

    cy
      .contains('Convertir')
      .click()

    cy
      .get('.text-red-400')
      .should('have.length', 3)
  })

  it('La fecha inicial no puede ser mayor que la fecha final', () => {

    cy
      .visit('http://localhost:4200/')

    cy
      .get('#search-panel')
      .find('input[type="datetime-local"]:first')
      .type("2025-12-23T23:59")

    cy
      .get('#search-panel')
      .contains('Consultar')
      .click()

    cy
      .contains('La fecha inicial no puede ser mayor que la fecha final')
  })
})