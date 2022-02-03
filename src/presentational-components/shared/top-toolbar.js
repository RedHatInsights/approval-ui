import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Level, LevelItem, Text, TextContent, TextVariants  } from '@patternfly/react-core';
import { ToolbarTitlePlaceholder } from './loader-placeholders';
import ApprovalBreadcrumbs from './breadcrumbs';
import clsx from 'clsx';

import './top-toolbar.scss';

export const TopToolbar = ({ children,  breadcrumbs, paddingBottom, className }) => (
  <div
    style={ {
      backgroundColor: 'var(--pf-global--palette--white)',
      marginLeft: '24',
      margingTop: '24'
    } }
    className={ clsx(
      'pf-u-pt-lg pf-u-pr-lg pf-u-pl-lg pf-u-ml-l pf-u-mt-lg',
      paddingBottom && 'pf-u-pb-sm',
      'top-toolbar',
      className
    ) }
  >
    { breadcrumbs && (<Level className="pf-u-mb-md">
      <ApprovalBreadcrumbs breadcrumbs={ breadcrumbs } />
    </Level>)
    }
    { children }
  </div>
);

TopToolbar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  breadcrumbs: PropTypes.array,
  paddingBottom: PropTypes.bool,
  className: PropTypes.string
};

TopToolbar.defaultProps = {
  paddingBottom: false
};

export const TopToolbarTitle = ({ title, description, children }) => (
  <Fragment>
    <Level>
      <LevelItem>
        <TextContent className="pf-u-mb-sm">
          <Text component={ TextVariants.h1 }>{ title || <ToolbarTitlePlaceholder /> }</Text>
        </TextContent>
        { description &&
              <TextContent className="pf-u-pt-sm pf-u-mb-md">
                <Text component={ TextVariants.p }>{ description }</Text>
              </TextContent> }
      </LevelItem>
      { children }
    </Level>
  </Fragment>
);

TopToolbarTitle.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};
