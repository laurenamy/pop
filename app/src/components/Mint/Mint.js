import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Container, Alert, Button } from 'react-bootstrap'
import { useMetaMask } from 'metamask-react'
import { DAPP_CONTRACT, KEY_URL } from '../../constants/constants'
import ItemToken from '../../contracts/ItemToken'
import { pinJSONToIPFS } from '../../utils/pinata.js'

const keyMetaData = {
  name: 'key',
  image: KEY_URL,
  description: 'a shiny key'
}

const Mint = () => {
  const web3 = new Web3(Web3.givenProvider)
  const ItemTokenContract = new web3.eth.Contract(ItemToken.abi, DAPP_CONTRACT)
  const { account, chainId } = useMetaMask()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [balance, setTokenBalance] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [transferAccount, setTransferAccount] = useState('')

  const getBalance = async () => {
    if (!ItemTokenContract || !account) return
    const res = await ItemTokenContract.methods.balanceOf(account).call()
    if (!res) return
    setTokenBalance(res)
  }

  useEffect(() => {
    getBalance()
    if (success) setError('')
  }, [success, setError, getBalance])

  const mintItem = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const response = await pinJSONToIPFS(keyMetaData)
      if (!response.success) return setError('IFPS Error Occurred')
      const tokenURI = response.pinataUrl

      const tx = await ItemTokenContract.methods.mintItem(tokenURI).send({
        from: account
      })
      if (tx.events?.Transfer) {
        setSuccess('You found a key!')
      } else {
        setError('Transaction failed. Try again later.')
      }
      setLoading(false)
    } catch (err) {
      console.log('Mint item error: ', err)
    }
  }

  const openDoor = async (userTokenBalance) => {
    setSuccess('')
    setError('')
    if (+userTokenBalance === 0) {
      setError('The door is locked')
      return
    }
    setSuccess('You opened the door!')
  }

  const onSubmit = async event => {
    setSuccess('')
    setError('')
    event.preventDefault()
    setLoading(true)

    try {
      const tx = await ItemTokenContract.methods.transfer(transferAccount).send({
        from: account
      })

      console.log('Transaction submitted: ', tx)

      if (tx.events.Transfer) {
        setSuccess('You successfully transfered your key')
      } else {
        setError('Transaction failed. Try again later.')
      }
      setLoading(false)
      setShowForm(false)
      setTokenBalance(0)
    } catch (error) {
      console.log({error})
      setError('Transaction failed. Try again later.')
      setLoading(false)
    }
  }

  return(
    <div>
      {!account && (
        <Container>
          <p>
            Connect your wallet and switch to the Rinkeby network!
          </p>
        </Container>
      )}
      {(account && +chainId !== 4) && (
        <Container>
          <p>
            Switch to the Rinkeby network
          </p>
        </Container>
      )}
      {(ItemTokenContract && account && +chainId === 4) && (
        <>
          <Container>
            <p>
              You come to a door and find that it's locked. What do you do?
            </p>
            {error && (
              <Alert variant='danger'>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant='success'>
                {success}
              </Alert>
            )}
            {loading && (<div>loading...</div>)}
            {+balance === 0 && (
              <Button onClick={() => mintItem()}>Look for a key</Button>
            )}
            <Button onClick={() => openDoor(balance)}>Try to open the door</Button>
            {balance > 0 && (
              <Button onClick={() => setShowForm(true)}>Transfer to a friend</Button>
            )}
          </Container>
          <Container>
            {showForm && (
              <>
                <form onSubmit={onSubmit}>
                  <label>
                    Transfer to:
                    <br />
                    <input 
                      type="text"
                      name="transferAccount"
                      value={transferAccount}
                      onChange={e => setTransferAccount(e.target.value) }
                      required
                    />
                  </label>
                  <Button type="submit" value="Transfer" >Transfer</Button>
                </form>
              </>
            )}
          </Container>
        </>
      )}
    </div>
  )
}

export default Mint