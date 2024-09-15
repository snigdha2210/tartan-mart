import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@emotion/react';

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
    border-bottom: 2px solid #C41230;
    opacity: 1;
  `}
`;

const TabGroup = ({ types, active, clickHandler }) => {
  const theme = useTheme();
  return (
    <div>
      {types.map((type) => (
        <Tab
          key={type}
          active={active === type ? active : null}
          onClick={() => clickHandler(type)}
          style={{ fontFamily: 'Inter'}}
        >
          {type}
        </Tab>
      ))}
    </div>
  );
};

export default TabGroup;
