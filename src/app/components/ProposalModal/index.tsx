import React from 'react';

import BigNumber from 'bignumber.js';
import { usePrevious } from 'react-use';
import { Flex } from 'rebass/styled-components';
import styled from 'styled-components';

import { Button } from 'app/components/Button';
import Divider from 'app/components/Divider';
import Modal from 'app/components/Modal';
import { Typography } from 'app/theme';
import { ReactComponent as CrossIcon } from 'assets/icons/failure.svg';
import { ReactComponent as TickIcon } from 'assets/icons/tick.svg';
import { useShouldLedgerSign } from 'store/application/hooks';

import LedgerConfirmMessage from '../LedgerConfirmMessage';
import Spinner from '../Spinner';

const CancelButton = styled(Button)`
  flex-grow: 1;
  max-height: 33px;
  max-width: 130px;
  font-size: 14px;
  background-color: inherit;
  color: ${({ theme }) => theme.colors.text1};
  &:hover {
    background-color: transparent;
    color: white;
    transition: background-color 0.2s ease;
  }
`;

const SubmitButton = styled(Button)`
  flex-grow: 1;
  max-height: 33px;
  max-width: 130px;
  font-size: 14px;
`;

export enum ModalStatus {
  'None' = 'None',
  'Approve' = 'Approve',
  'Reject' = 'Reject',
}

interface ProposalProps {
  status: ModalStatus;
  onCancel: () => void;
  onSubmit: () => void;
  weight: BigNumber | undefined;
}

export function ProposalModal(props: ProposalProps) {
  const { status, onCancel, onSubmit, weight } = props;
  const isOpen = status !== ModalStatus.None;

  const shouldLedgerSign = useShouldLedgerSign();

  // the code prevents flicking while this modal is closing.
  const prevStatus = usePrevious(status);
  const UIStatus = status === ModalStatus.None ? prevStatus : status;

  return (
    <Modal isOpen={isOpen} onDismiss={onCancel}>
      <Flex flexDirection="column" alignItems="stretch" m={5} width="100%">
        <Typography variant="content" textAlign="center" mb={1}>
          Submit vote?
        </Typography>
        {UIStatus === ModalStatus.Reject && (
          <>
            <CrossIcon
              width="35px"
              height="35px"
              style={{ margin: 'auto', display: 'block', marginTop: '5px', marginBottom: '5px' }}
            />
            <Typography variant="h3" textAlign="center" mb={3}>
              Reject
            </Typography>
          </>
        )}
        {UIStatus === ModalStatus.Approve && (
          <>
            <TickIcon
              width="35px"
              height="35px"
              style={{ margin: 'auto', display: 'block', marginTop: '5px', marginBottom: '5px' }}
            />
            <Typography variant="h3" textAlign="center" mb={3}>
              Approve
            </Typography>
          </>
        )}
        <Typography variant="content" textAlign="center" mb={3}>
          {`Voting weight: ${weight?.dp(2).toFormat()} BALN`}
        </Typography>
        <Divider mb={5} />
        <Flex flexDirection="row" width="100%" justifyContent="center">
          {shouldLedgerSign && <Spinner />}
          {!shouldLedgerSign && (
            <>
              <CancelButton onClick={onCancel}>Cancel</CancelButton>
              <SubmitButton onClick={onSubmit}>Submit vote</SubmitButton>
            </>
          )}
        </Flex>
        <LedgerConfirmMessage />
      </Flex>
    </Modal>
  );
}
