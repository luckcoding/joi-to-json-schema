import * as assert from 'assert'
import * as Joi from '@hapi/joi'
import * as TYPES from './types'

/**
 * Converts the supplied joi validation object into a JSON schema object,
 * optionally applying a transformation.
 *
 * @param {JoiValidation} joi
 * @param {TransformFunction} [transformer=null]
 * @returns {JSONSchema}
 */
const convert = (joi, transformer = null) => {
    assert(
        'object' === typeof joi && true === Joi.isSchema(joi),
        'requires a joi schema object'
    )
    assert(joi.type, 'joi schema object must have a type')

    if (!TYPES[joi.type]) {
        throw new Error(
            `sorry, do not know how to convert unknown joi type: "${joi.type}"`
        )
    }

    if (transformer) {
        assert(
            'function' === typeof transformer,
            'transformer must be a function'
        )
    }

    // JSON Schema root for this type.
    const schema: any = {}
    // Copy over the details that all schemas may have...
    if (joi?._flags?.description) {
        schema.description = joi?._flags?.description
    }
    const joiExamples = joi?.$_terms?.examples
    if (joiExamples && joiExamples.length > 0) {
        // schema.examples = joiExamples.map(e => e.value)
        schema.examples = joiExamples
    }

    if (joiExamples && joiExamples.length === 1) {
        schema.example = joiExamples[0]
    }

    // Add the label as a title if it exists
    if (joi?._settings?.language?.label) {
        schema.title = joi._settings.language.label
    } else if (joi?._flags?.label) {
        schema.title = joi._flags.label
    }
    // Checking for undefined and null explicitly to allow false and 0 values
    if (
        joi._flags &&
        joi._flags.default !== undefined &&
        joi._flags.default !== null
    ) {
        schema['default'] = joi._flags.default
    }
    if (
        joi._valids &&
        joi._valids._values &&
        (joi._valids._values.size || joi._valids._values.length)
    ) {
        if (Array.isArray(joi.$_terms.items) || !joi._flags.only) {
            return {
                anyOf: [
                    {
                        type: joi.type,
                        enum: [...joi._valids._values]
                    },
                    TYPES[joi.type](convert, schema, joi, transformer)
                ]
            }
        }
        schema['enum'] = [...joi._valids._values]
    }

    let result = TYPES[joi.type](convert, schema, joi, transformer)

    if (transformer) {
        result = transformer(result, joi)
    }

    return result
}
convert.TYPES = TYPES
export default convert
/**
 * Joi Validation Object
 * @typedef {object} JoiValidation
 */

/**
 * Transformation Function - applied just before `convert()` returns and called as `function(object):object`
 * @typedef {function} TransformFunction
 */

/**
 * JSON Schema Object
 * @typedef {object} JSONSchema
 */
