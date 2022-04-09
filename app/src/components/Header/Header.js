import React from 'react'
import { Navbar, Container } from 'react-bootstrap'
import { Button, Badge } from 'react-bootstrap'
import { useMetaMask } from 'metamask-react'
import truncateEthAddress from 'truncate-eth-address'

const Header = () => {
  const { status, connect, account } = useMetaMask()
  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>POP</Navbar.Brand>
          {status === "notConnected" && (
            <Button onClick={connect}>Connect to MetaMask</Button>
          )}
          {status === "connected" && (
            <Badge bg="primary">{truncateEthAddress(account)}</Badge>
          )}
        </Container>
      </Navbar>
    </header>
  )
}

export default Header