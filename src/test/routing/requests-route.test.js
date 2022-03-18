import { MemoryRouter, Route } from 'react-router-dom';
import UserContext from '../../user-context';
import RequestsRoute from '../../routing/requests-route';
import { IntlProvider } from 'react-intl';
import { APPROVAL_ADMIN_ROLE, APPROVAL_APPR_ROLE } from '../../utilities/constants';

describe('<RequestsRoute />', () => {
  const ComponentWrapper = ({ children, value }) => (
    <IntlProvider locale="en">
      <MemoryRouter initialEntries={ [ '/initial' ] } initialIndex={ 0 }>
        <UserContext.Provider value={ value }>
          <Route path="/initial">
            { children }
          </Route>
        </UserContext.Provider>
      </MemoryRouter>
    </IntlProvider>
  );

  beforeEach(() => {
    global.localStorage.setItem('catalog_standalone', true);
    global.localStorage.setItem('user', 'testUser');
  });

  afterEach(() => {
    global.localStorage.setItem('catalog_standalone', false);
    global.localStorage.removeItem('user');
    jest.clearAllMocks();
  });

  it('is neither approval admin nor approver', () => {
    const roles = [];
    const wrapper = mount(
      <ComponentWrapper value={ { userRoles: roles } }>
        <RequestsRoute />
      </ComponentWrapper>
    );

    expect(wrapper.find(Route)).toHaveLength(1);
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/403');
  });

  it('is an approver admin', () => {
    const wrapper = mount(
      <ComponentWrapper value={ { userRoles: [ `${APPROVAL_ADMIN_ROLE}` ]} }>
        <RequestsRoute />
      </ComponentWrapper>
    );
    expect(wrapper.find(Route)).toHaveLength(2);
    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/initial');
  });

  it('is an approver', () => {
    const wrapper = mount(
      <ComponentWrapper value={ { userRoles: [ `${APPROVAL_APPR_ROLE}` ]} }>
        <RequestsRoute />
      </ComponentWrapper>
    );

    expect(wrapper.find(Route)).toHaveLength(2);
  });
});
