import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'yaxp4mxn',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token:
    'skOqLrIDgZC6MwOi1QDO6Ba3yyElolijHhySduXaYaCIC2geZov6zgCsCYcWnXFJsKZ8Cuf00Fb8TjPRITW9RP5EneZ2B8sSTRQFGOSlzeGJdpXjIOV87neF3p9Njk4jGHGzJdE5wp5xgXbcdVCVg6nB4DkynWT4baxxwJcKrkuZM5X9Pp0J',
  useCdn: false,
})
