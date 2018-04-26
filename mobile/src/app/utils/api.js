import Config from 'react-native-config'
import { SubmissionError } from 'redux-form'
import keys from 'lodash/keys'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import isObject from 'lodash/isObject'
import flatMapDeep from 'lodash/flatMapDeep'
import get from 'lodash/get'
// TODO it seems we can move all query logic to API
import { buildQueryParams } from './queryParams'
// import { logout } from 'pages/session'

export const API_URL = Config.API_URL + '/api/v1'

// FIXME make it as middleware

export default function (endpoint) {
  return new API(endpoint)
}

function deepValues (obj) {
  // creates flat list of all `obj` values (including nested)
  if (isPlainObject(obj) || Array.isArray(obj)) {
    return flatMapDeep(obj, deepValues)
  }
  return obj
}

function hasFile (obj) {
  // check if `obj` has at least one `File` instance
  return !!obj.uri
}

class API {
  constructor (endpoint) {
    if (!/^\w[^?]+\w$/.test(endpoint)) {
      console.error('invalid API endpoint: \'%s\'. API endpoint should not contain trailing slashes and query params', endpoint)
    }
    this.endpoint = endpoint
  }

  prepareBody (body, isMultipartFormData) {
    if (isEmpty(body)) {
      return body
    }

    if (isMultipartFormData) {
      var formData = new FormData()
      let file = body
      formData.append('file', file)
      return formData
    } else {
      return JSON.stringify(body)
    }
  }

  handleResponseCallback (response) {
    if (response.status === 401) {
      // 401 (Unauthorized)
      return
    } else if (response.status === 204) {
      // 204 (No Content)
      return Promise.resolve({})
    }

    if (response.headers.get('Content-Type') !== 'application/json') {
      return Promise.reject(response)
    }

    return response.json()
      .then(function (body) {
        if (response.ok) {
          return body
        }

        // handle errors
        var errors = {}
        keys(body).forEach(key => {
          let eKey = key
          if (key === 'non_field_errors' || key === 'nonFieldErrors' || key === 'detail') {
            eKey = '_error'
          }
          if (Array.isArray(body[key])) {
            errors[eKey] = body[key][0]
          } else {
            errors[eKey] = body[key]
          }
        })
        throw new SubmissionError(errors)
      })
  }

  request (method, params = {}, body = {}) {
    const queryParams = isEmpty(params) ? '' : '?' + buildQueryParams(params)
    const resource = `${API_URL}/${this.endpoint}/${queryParams}`
    let headers = {
      'Content-Type': 'application/json'
    }
    const isMultipartFormData = hasFile(body)
    if (isMultipartFormData) {
      headers = {
        'Content-Type': 'multipart/form-data'
      }
    }

    body = this.prepareBody(body, isMultipartFormData)
    if (method === 'GET') body = undefined
    const options = {
      method,
      headers,
      body
    }

    return fetch(resource, options).then(this.handleResponseCallback)
  }

  post (body = {}, params = {}) {
    return this.request('POST', params, body)
  }

  get (params) {
    return this.request('GET', params)
  }

  put (body = {}, params = {}) {
    return this.request('PUT', params, body)
  }

  patch (body = {}, params = {}) {
    return this.request('PATCH', params, body)
  }

  options () {
    return this.request('OPTIONS')
  }

  delete () {
    return this.request('DELETE')
  }
}
