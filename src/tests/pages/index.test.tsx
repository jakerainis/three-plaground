import Home from 'pages/index'
import { render } from 'tests/testUtils'

describe('Home page', () => {
  it('Renders the title', () => {
    const { getByText } = render(<Home />, {})
    expect(getByText('Welcome to Next.js!')).toBeTruthy()
  })
})
