import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  // We will do query when doing ssr, because we don't have cookie in Next.js server, we have it only in browser
  // So, instead we will render HTML in broswer and only them do query from browser, not Next.js server
  const [isServer, setIsServer] = useState(true);
  const [{ data, fetching }] = useMeQuery({
    pause: isServer,
  });
  useEffect(() => setIsServer(false), []);

  let navigation = null;
  if (fetching) {
    navigation = null;
  } else if (!data?.me) {
    navigation = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>register</Link>
        </NextLink>
      </>
    );
  } else {
    navigation = (
      <Box mr={2}>
        <Flex>
          <Box mr={2}>{data.me.username}</Box>
          <Button
            variant="link"
            colorScheme="cyan"
            onClick={async () => {
              await logout({});
              router.push('/login');
            }}
            isLoading={logoutFetching}
          >
            logout
          </Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Flex bg="teal" p={2} h={'5vh'}>
      <Box>Pigs on the Wing</Box>
      <Box ml="auto">{navigation}</Box>
    </Flex>
  );
};

export default NavBar;
