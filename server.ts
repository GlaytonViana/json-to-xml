import express, { Request, Response } from 'express'
import xmlJs from 'xml-js'
import jsonToXml from 'jsontoxml'
import { XMLBuilder } from 'fast-xml-parser'

const app = express()
app.use(express.json())

app.post('/xml-js', (request: Request, response: Response) => {
    const json = request.body
    const jsonInXml = xmlJs.json2xml(json.Envelope, {
        compact: true,
        spaces: 4,

        // textFn: val => {
        //     return val.toUpperCase()
        // },

        elementNameFn: val => {
            let tagName = ''

            switch (val.toUpperCase()) {
                case 'ENVELOPE':
                    tagName = `x:${val} xmlns:x="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bas="BASE-PC"`
                    break

                case 'HEADER':
                case 'BODY':
                    tagName = `x:${val}`
                    break

                default:
                    tagName = `bas:${val}`
                    break
            }

            return tagName
        },
    })

    const wrapInEnvelope = `<x:Envelope xmlns:x="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bas="BASE-PC">${jsonInXml}</x:Envelope>`

    return response.contentType('text/xml').end(wrapInEnvelope)
})

app.post('/json-to-xml', (request: Request, response: Response) => {
    const json = request.body
    const jsonInXml = jsonToXml(json, {
        xmlHeader: true,
    })
    return response.contentType('text/xml').end(jsonInXml)
})

app.post('/fast-xml-parser', (request: Request, response: Response) => {
    const json = request.body

    const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: 'x',
        textNodeName: 'x',
        format: true,
    })

    const jsonInXml = builder.build(json)
    return response.contentType('text/xml').end(jsonInXml)
})

app.listen(3000, () => {
    console.log('server ON')
})
