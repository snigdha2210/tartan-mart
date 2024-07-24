import React from 'react';
import styled from 'styled-components';

const Tab = styled.button`
  padding: 10px 30px;
  cursor: pointer;
  opacity: 0.6;
  background: white;
  border: 0;
  outline: 0;
  border-bottom: 2px solid transparent;
  transition: ease border-bottom 250ms;
  color: black;
  font-weight: bold;
  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid black;
    opacity: 1;
  `}
`;

const TabGroup = ({ types, active, clickHandler }) => {
  return (
    <div>
      {types.map((type) => (
        <Tab
          key={type}
          active={active === type ? active : null}
          onClick={() => clickHandler(type)}
          style={{ fontFamily: 'Inter' }}
        >
          {type}
        </Tab>
      ))}
    </div>
  );
};

export default TabGroup;
