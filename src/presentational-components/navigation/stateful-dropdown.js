import * as React from 'react';

import {
  Dropdown,
  DropdownPosition,
  KebabToggle,
  DropdownToggle
} from '@patternfly/react-core';

export class StatefulDropdown extends React.Component {
  static defaultProps = {
    isPlain: true,
    toggleType: 'kebab'
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      selected: undefined
    };
  }

  render() {
    const { isOpen } = this.state;
    const {
      items,
      toggleType,
      defaultText,
      position,
      isPlain,
      ariaLabel
    } = this.props;
    return (
      <Dropdown
        onSelect={ (e) => this.onSelect(e) }
        toggle={ this.renderToggle(toggleType, defaultText) }
        isOpen={ isOpen }
        isPlain={ isPlain }
        dropdownItems={ items }
        position={ position || DropdownPosition.right }
        autoFocus={ false }
        aria-label={ ariaLabel }
      />
    );
  }

  renderToggle(toggleType, defaultText) {
    switch (toggleType) {
      case 'dropdown':
        return (
          <DropdownToggle onToggle={ (e) => this.onToggle(e) }>
            { this.state.selected
              ? this.state.selected
              : defaultText || '' }
          </DropdownToggle>
        );
      case 'icon':
        return (
          <DropdownToggle
            toggleIndicator={ null }
            onToggle={ (e) => this.onToggle(e) }
          >
            { this.state.selected
              ? this.state.selected
              : defaultText || '' }
          </DropdownToggle>
        );
      case 'kebab':
        return <KebabToggle onToggle={ (e) => this.onToggle(e) } />;
    }
  }

  onToggle(isOpen) {
    this.setState({
      isOpen
    });
  }

  onSelect(event) {
    this.setState(
      {
        isOpen: !this.state.isOpen,
        selected: event.currentTarget.value
      },
      () => {
        if (this.props.onSelect) {
          this.props.onSelect(event);
        }
      }
    );
  }
}
