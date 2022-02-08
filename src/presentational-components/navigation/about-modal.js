import * as React from 'react';
import {
  AboutModal,
  TextContent,
  TextList,
  TextListItem
} from '@patternfly/react-core';
import Logo from '../../assets/images/logo-large.svg';
import { detect } from 'detect-browser';

export const AboutModalWindow = (props) => {
  const { isOpen, onClose, brandImageAlt, productName, userName } = props;
  const browser = detect();
  return (
    <AboutModal
      isOpen={ isOpen }
      trademark=""
      brandImageSrc={ Logo }
      onClose={ onClose }
      brandImageAlt={ brandImageAlt }
      productName={ productName }
    >
      <TextContent>
        <TextList>
          <TextListItem>
            { `Username` }
          </TextListItem>
          <TextListItem>
            { userName }
          </TextListItem>
          <TextListItem>
            { `Browser Version` }
          </TextListItem>
          <TextListItem>
            { browser?.name + ' ' + browser?.version }
          </TextListItem>
          <TextListItem>
            { `Browser OS` }
          </TextListItem>
          <TextListItem>
            { browser?.os }
          </TextListItem>
        </TextList>
      </TextContent>
    </AboutModal>
  );
};
