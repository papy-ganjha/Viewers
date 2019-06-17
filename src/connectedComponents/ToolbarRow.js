import './ToolbarRow.css';

import React, { Component } from 'react';
import { RoundedButtonGroup, ToolbarButton } from 'react-viewerbase';
import { commandsManager, extensionManager } from './../App.js';

import ConnectedLayoutButton from './ConnectedLayoutButton';
import ConnectedPluginSwitch from './ConnectedPluginSwitch.js';
import { MODULE_TYPES } from 'ohif-core';
import PropTypes from 'prop-types';

class ToolbarRow extends Component {
  static propTypes = {
    leftSidebarOpen: PropTypes.bool.isRequired,
    rightSidebarOpen: PropTypes.bool.isRequired,
    setLeftSidebarOpen: PropTypes.func,
    setRightSidebarOpen: PropTypes.func,
    activeContexts: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    leftSidebarOpen: false,
    rightSidebarOpen: false,
  };

  constructor(props) {
    super(props);

    const toolbarButtonDefinitions = _getVisibleToolbarButtons.call(this);
    // TODO:
    // If it's a tool that can be active... Mark it as active?
    // - Tools that are on/off?
    // - Tools that can be bound to multiple buttons?

    // Normal ToolbarButtons...
    // Just how high do we need to hoist this state?
    // Why ToolbarRow instead of just Toolbar? Do we have any others?
    this.state = {
      toolbarButtons: toolbarButtonDefinitions,
      activeButtons: [],
    };
  }

  componentDidUpdate(prevProps) {
    const activeContextsChanged =
      prevProps.activeContexts !== this.props.activeContexts;

    if (activeContextsChanged) {
      this.setState({
        toolbarButtons: _getVisibleToolbarButtons.call(this),
      });
    }
  }

  onLeftSidebarValueChanged = value => {
    this.props.setLeftSidebarOpen(!!value);
  };

  onRightSidebarValueChanged = value => {
    this.props.setRightSidebarOpen(!!value);
  };

  render() {
    const leftSidebarToggle = [
      {
        value: 'studies',
        icon: 'th-large',
        bottomLabel: 'Series',
      },
    ];

    const rightSidebarToggle = [
      {
        value: 'measurements',
        icon: 'list',
        bottomLabel: 'Measurements',
      },
    ];

    const leftSidebarValue = this.props.leftSidebarOpen
      ? leftSidebarToggle[0].value
      : null;

    const rightSidebarValue = this.props.rightSidebarOpen
      ? rightSidebarToggle[0].value
      : null;

    //const getButtonComponents = _getButtonComponents.bind(this);
    const buttonComponents = _getButtonComponents.call(
      this,
      this.state.toolbarButtons,
      this.state.activeButtons
    );

    return (
      <div className="ToolbarRow">
        <div className="pull-left m-t-1 p-y-1" style={{ padding: '10px' }}>
          <RoundedButtonGroup
            options={leftSidebarToggle}
            value={leftSidebarValue}
            onValueChanged={this.onLeftSidebarValueChanged}
          />
        </div>
        {buttonComponents}
        <ConnectedLayoutButton />
        <ConnectedPluginSwitch />
        <div className="pull-right m-t-1 rm-x-1" style={{ marginLeft: 'auto' }}>
          <RoundedButtonGroup
            options={rightSidebarToggle}
            value={rightSidebarValue}
            onValueChanged={this.onRightSidebarValueChanged}
          />
        </div>
      </div>
    );
  }
}

/**
 * Determine which extension buttons should be showing, if they're
 * active, and what their onClick behavior should be.
 */
function _getButtonComponents(toolbarButtons, activeButtons) {
  return toolbarButtons.map((button, index) => {
    // TODO: If `button.buttons`, use `ExpandedToolMenu`
    // I don't believe any extensions currently leverage this
    return (
      <ToolbarButton
        key={button.id}
        label={button.label}
        icon={button.icon}
        onClick={(evt, props) => {
          if (button.commandName) {
            const options = Object.assign({ evt }, button.commandOptions);
            commandsManager.runCommand(button.commandName, options);
          }

          // TODO: Use Types ENUM
          // TODO: We can update this to be a `getter` on the extension to query
          //       For the active tools after we apply our updates?
          if (button.type === 'setToolActive') {
            this.setState({
              activeButtons: [button.id],
            });
          }
        }}
        isActive={activeButtons.includes(button.id)}
      />
    );
  });
}

function _getVisibleToolbarButtons() {
  const toolbarModules = extensionManager.modules[MODULE_TYPES.TOOLBAR];
  const toolbarButtonDefinitions = [];

  toolbarModules.forEach(extension => {
    const { definitions, defaultContext } = extension.module;
    definitions.forEach(definition => {
      const context = definition.context || defaultContext;

      console.log(context);
      if (this.props.activeContexts.includes(context)) {
        console.log('includes: ', definition.commandName);
        toolbarButtonDefinitions.push(definition);
      }
    });

    console.log(extension);
  });

  return toolbarButtonDefinitions;
}

export default ToolbarRow;
