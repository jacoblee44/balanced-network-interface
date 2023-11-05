import React from 'react';

import { useIconReact } from 'packages/icon-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Flex } from 'rebass/styled-components';

import { ButtonLink } from 'app/components/Button';
import { DefaultLayout } from 'app/components/Layout';
import { BoxPanel } from 'app/components/Panel';
import ProposalInfo from 'app/components/ProposalInfo';
import { Typography } from 'app/theme';
import { useTotalProposalQuery, useActiveProposals } from 'queries/vote';

export function VotePage() {
  const { data: proposals } = useTotalProposalQuery();
  const { account } = useIconReact();
  const useActiveProposalsQuery = useActiveProposals();
  const { data: activeProposals } = useActiveProposalsQuery;

  const shouldShowNotification = currentProposal => {
    return (
      activeProposals && activeProposals.filter(proposal => parseInt(proposal.id, 16) === currentProposal.id).length > 0
    );
  };

  return (
    <DefaultLayout title="Vote">
      <Helmet>
        <title>Vote</title>
      </Helmet>

      <BoxPanel bg="bg2" width="100%">
        <Flex justifyContent="space-between" mb={5}>
          <Typography variant="h2">Proposals</Typography>
          {account && <ButtonLink to="/vote/new-proposal/">New proposal</ButtonLink>}
        </Flex>

        {proposals ? (
          proposals
            .sort((a, b) => b?.id - a?.id)
            .map(proposal => (
              <Link key={proposal.id} to={`/vote/proposal/${proposal?.id}`} style={{ textDecoration: 'none' }}>
                <ProposalInfo proposal={proposal} showNotification={shouldShowNotification(proposal)} />
              </Link>
            ))
        ) : (
          <>
            <ProposalInfo />
            <ProposalInfo />
            <ProposalInfo />
            <ProposalInfo />
            <ProposalInfo />
            <ProposalInfo />
          </>
        )}
      </BoxPanel>
    </DefaultLayout>
  );
}
