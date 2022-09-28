import NavBar from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../helpers/create-urql-client';
import CollectionList from '../components/Collection/CollectionList';
import { Box, Flex } from '@chakra-ui/react';
import Workspace from '../components/Workspace/Workspace';
import { useEffect } from 'react';
import Image from 'next/image';
import PigImg from '../public/pig.png';
import EyeImg from '../public/eye.png';
import { onMouseMoveListener } from '../helpers/little-pig';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const eyeSize = '18px';
const pigSize = '125px';

const Index = () => {
  // useIsAuth();
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMoveListener);

    return () => {
      document.removeEventListener('mousemove', onMouseMoveListener);
    };
  });

  return (
    <Box w={'100vw'} h={'100vh'}>
      <NavBar />
      <Flex h={'95vh'}>
        <Provider store={store}>
          <Box p={2} minW={'30vw'} borderRight={'1px'}>
            <CollectionList />
          </Box>
          <Box minW={'70vw'}>
            <Workspace />
          </Box>
        </Provider>
        <Box
          position={'absolute'}
          width={pigSize}
          height={pigSize}
          bottom={'10px'}
          left={'5px'}
          id={'anchor'}
        >
          <Box id="test" position={'relative'} width={pigSize} height={pigSize}>
            <Box position={'absolute'}>
              <Image src={PigImg} width={pigSize} height={pigSize} />
            </Box>
            <Box
              position={'absolute'}
              width={eyeSize}
              height={eyeSize}
              bottom={'62px'}
              left={'89px'}
              id={'right-eye'}
              className={'eye'}
            >
              <Image src={EyeImg} width={eyeSize} height={eyeSize} />
            </Box>
            <Box
              width={eyeSize}
              height={eyeSize}
              bottom={'59px'}
              left={'73px'}
              id={'left-eye'}
              className={'eye'}
              position={'absolute'}
            >
              <Image src={EyeImg} width={eyeSize} height={eyeSize} />
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
