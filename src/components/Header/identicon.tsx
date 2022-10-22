import React, { useEffect, useRef } from 'react';
import { Avatar, forwardRef, AvatarProps } from '@chakra-ui/react';

import styled from 'styled-components';

import Jazzicon from 'jazzicon';
import { useActiveWeb3React } from '../../hooks';

const StyledIdenticonContainer = styled.div`
  margin:auto;
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: #CED0D9;
`

export default function Identicon() {
  const ref = useRef()

  const { account } = useActiveWeb3React()

  useEffect(() => {
    if (account && ref.current) {
      (ref as any).current.innerHTML = ''
      const jazzicon = (ref as any).current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)))
      jazzicon.style.display = 'block';
    }
  }, [account])

  return (
    <JazzAvatar ref={ref as any} />
  )
}

const JazzAvatar = forwardRef<AvatarProps, "div">((props, ref) => (
  <Avatar
    bgColor="white"
    size="xs"
    ml={-2}
    mr={2}
    ref={ref}
    {...props}
  />
))
