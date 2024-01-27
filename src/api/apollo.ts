import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, concat } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { getJwtToken, setJwtToken } from '@app/helpers/TokenStoreUtils'
import axiosInstance from './axios'
import { getAsJSON } from '@app/helpers/LocalStorageUtils'

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql', // Set your GraphQL server endpoint
})

// Create an ApolloLink middleware to add the Authorization header
const authMiddleware = new ApolloLink((operation, forward) => {
  if (getJwtToken()) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${getJwtToken()}`,
        'Content-type': 'application/json',
        Accept: 'application/json',
      },
    })
  }

  return forward(operation)
})

const refreshJwtToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh', getAsJSON('USER'))

    const newToken = response.data.token

    setJwtToken(newToken)

    return newToken
  } catch (error) {
    console.error('Error refreshing JWT token:', error)
    throw error
  }
}

// @ts-ignore
const errorLink = onError(({ networkError, operation, forward }) => {
  // @ts-ignore
  const isExpired = networkError.statusCode === 401 && networkError.result.message === 'JWT.EXPIRED'
  if (networkError && isExpired) {
    // JWT token expired, perform token refresh
    return refreshJwtToken()
      .then((newToken) => {
        // Update the Authorization header with the new token
        const oldHeaders = operation.getContext().headers

        operation.setContext(() => ({
          headers: {
            ...oldHeaders,
            Authorization: `Bearer ${newToken}`,
          },
        }))

        return forward(operation)
      })
      .catch((refreshError) => {
        console.error('Token refresh error:', refreshError)
      })
  }
})

const apolloClient = new ApolloClient({
  link: concat(errorLink, concat(authMiddleware, httpLink)),
  cache: new InMemoryCache(),
})

export default apolloClient
