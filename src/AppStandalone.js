import React, { Fragment, Suspense, useEffect, useState } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { Routes } from './Routes';
import { AppPlaceholder } from './presentational-components/shared/loader-placeholders';
// react-int eng locale data
import { IntlProvider } from 'react-intl';
import { reject, some } from 'lodash';
import '@patternfly/patternfly/patternfly.scss';

import UserContext from './user-context';

import './App.scss';
import {
  DropdownItem,
  Nav,
  NavExpandable,
  NavGroup,
  NavItem,
  NavList, Page,
  PageHeader,
  PageHeaderTools,
  PageSection,
  PageSidebar
} from '@patternfly/react-core';
import { getUser, logoutUser } from './helpers/shared/active-user';
import { AboutModalWindow } from './presentational-components/navigation/about-modal/about-modal';
import { ExternalLinkAltIcon, QuestionCircleIcon } from '@patternfly/react-icons';
import { SmallLogo } from './presentational-components/navigation/small-logo';
import { StatefulDropdown } from './presentational-components/navigation/stateful-dropdown';
import { Logo } from './presentational-components/navigation/logo';

const pathName = window.location.pathname.split('/');
import { useLocation } from 'react-router';
import { MIN_SCREEN_HEIGHT } from './utilities/constants';
pathName.shift();

export const Paths = {
  products: '/products',
  platforms: '/platforms',
  platform: '/platforms/platform',
  portfolios: '/portfolios',
  portfolio: '/portfolios/portfolio',
  orders: '/orders',
  order: 'orders/order',
  approval: '/approval'
};

const App = () => {
  localStorage.setItem('catalog_standalone', true);
  const [ user, setUser ] = useState(null);
  const [ aboutModalVisible, setAboutModalVisible ] = useState(false);
  const [ menuExpandedSections, setMenuExpandedSections ] = useState([]);

  const location = useLocation();

  const menu = () => {
    const menuItem = (name, options = {}) => ({
      condition: () => true,
      ...options,
      type: 'item',
      name
    });
    const baseUrl = 'https://catalog.k8s.local/ui/';
    console.log('Debug approval - location: ', location);
    return [
      menuItem('Products', {
        url: `${baseUrl}catalog${Paths.products}`
      }),
      menuItem('Portfolios', {
        url: `${baseUrl}catalog${Paths.portfolios}`
      }),
      menuItem('Platforms', {
        url: `${baseUrl}catalog${Paths.platforms}`
      }),
      menuItem('Orders', {
        url: `${baseUrl}catalog${Paths.orders}`
      }),
      menuItem('Approval', {
        url: `${baseUrl}${Paths.approval}`
      }),
      menuItem(`Documentation`, {
        url:
          'https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/',
        external: true
      })
    ];
  };

  const activateMenu = (items) => {
    items.forEach(
      (item) =>
        (item.active =
          item.type === 'section'
            ? activateMenu(item.items)
            : location.pathname.startsWith(item.url))
    );
    return some(items, 'active');
  };

  useEffect(() => {
    const activeMenu = menu();
    activateMenu(activeMenu);
    setMenuExpandedSections(
      activeMenu
      ?.filter((i) => i.type === 'section' && i.active)
      .map((i) => i.name)
    );
  }, []);

  useEffect(() => {
    getUser().then((user) => setUser(user));
  }, []);

  let docsDropdownItems = [];
  let userDropdownItems = [];
  let userName = null;

  if (user) {
    if (user.first_name || user.last_name) {
      userName = user.first_name + ' ' + user.last_name;
    } else {
      userName = user.username;
    }

    userDropdownItems = [
      <DropdownItem isDisabled key="username">
        Username: { user.username }
      </DropdownItem>,
      <DropdownItem
        key="logout"
        aria-label={ 'logout' }
        onClick={ () =>
          logoutUser().then(() => {
            setUser(null);
          })
        }
      >
        { `Logout` }
      </DropdownItem>
    ];
  }

  const aboutModal = () => {
    return (
      <AboutModalWindow
        isOpen={ aboutModalVisible }
        trademark=""
        brandImageSrc={ Logo }
        onClose={ () => setAboutModalVisible(false) }
        brandImageAlt={ `Ansible Logo` }
        productName={ 'Ansible Automation Catalog' }
        user={ user }
        userName={ userName }
      />
    );
  };

  docsDropdownItems = [
    <DropdownItem
      key="customer_support"
      href="https://access.redhat.com/support"
      target="_blank"
    >
      Customer Support <ExternalLinkAltIcon />
    </DropdownItem>,
    <DropdownItem
      key="training"
      href="https://www.ansible.com/resources/webinars-training"
      target="_blank"
    >
      Training <ExternalLinkAltIcon />
    </DropdownItem>,
    <DropdownItem key="about" onClick={ () => setAboutModalVisible(true) }>
      { `About` }
    </DropdownItem>
  ];

  const headerNav = () => (
    <PageHeader
      logo={ <SmallLogo alt={ 'Ansible automation catalog' } /> }
      headerTools={
        <PageHeaderTools>
          <div>
            <StatefulDropdown
              ariaLabel={ 'docs-dropdown' }
              defaultText={ <QuestionCircleIcon /> }
              items={ docsDropdownItems }
              toggleType="icon"
            />
            <StatefulDropdown
              ariaLabel={ 'user-dropdown' }
              defaultText={ userName }
              items={ userDropdownItems }
              toggleType="dropdown"
            />
          </div>
        </PageHeaderTools>
      }
      showNavToggle
    />
  );

  activateMenu(menu());

  const MenuItem = ({ item }) => (
    <NavItem
      isActive={ item.active }
      onClick={ (e) => {
        item.onclick && item.onclick();
        e.stopPropagation();
      } }
    >
      { item.url && item.external ? (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a href={ item.url } data-cy={ item['data-cy'] } target="_blank">
          { item.name }
          <ExternalLinkAltIcon
            style={ { position: 'absolute', right: '32px' } }
          />
        </a>
      ) : item.url ? (
        <a href={ item.url } to={ item.url }>
          { item.name }
        </a>
      ) : (
        item.name
      ) }
    </NavItem>
  );

  const ItemOrSection = ({ item }) =>
    item.type === 'section' ? (
      <MenuSection section={ item } />
    ) : (
      <MenuItem item={ item } />
    );

  const Menu = ({ items }) => (
    <Fragment>
      { items.map((item) => (
        <ItemOrSection key={ item.name } item={ item } />
      )) }
    </Fragment>
  );

  const MenuSection = ({ section }) => (
    <NavExpandable
      title={ section.name }
      groupId={ section.name }
      isActive={ section.active }
      isExpanded={ menuExpandedSections.includes(section.name) }
    >
      <Menu items={ section.items } />
    </NavExpandable>
  );

  const onToggle = ({ groupId, isExpanded }) => {
    return setMenuExpandedSections(
      isExpanded
        ? [ ...menuExpandedSections, groupId ]
        : reject(menuExpandedSections, (name) => name === groupId)
    );
  };

  const sidebarNav = () => (
    <Fragment>
      <PageSidebar
        theme="dark"
        nav={
          <Nav theme="dark" onToggle={ onToggle }>
            <NavList>
              <NavGroup
                className={ 'nav-title' }
                title={ 'Ansible Automation Catalog' }
              />
              <Menu items={ menu() } />
            </NavList>
          </Nav>
        }
      />
    </Fragment>
  );

  return (
    <Suspense fallback={ <AppPlaceholder /> }>
      <div id="app-render-root" className="pf-c-drawer__content">
        <Page classname=".pf-c-page__main" isManagedSidebar={ true } header={ headerNav() } sidebar={ sidebarNav() }>
          { aboutModalVisible && aboutModal() }
          <IntlProvider locale="en">
            <UserContext.Provider value={ { userRoles: { 'Approval Administrator': true }} }>
              <React.Fragment>
                <NotificationsPortal />
                <div style={ { minHeight: MIN_SCREEN_HEIGHT } }>
                  <Routes/>
                </div>
              </React.Fragment>
            </UserContext.Provider>
          </IntlProvider>
        </Page>
      </div>
    </Suspense>
  );
};

export default App;
