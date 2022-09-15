import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

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
            onClick={() => logout({})}
            isLoading={logoutFetching}
          >
            logout
          </Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Flex bg="teal" p={2}>
      Pigs on the Wing
      <Box ml="auto">{navigation}</Box>
    </Flex>
  );
};

export default NavBar;
