/**
 * The contents of this file are subject to the CYPHON Proprietary Non-
 * Commercial Registered User Use License Agreement (the "Agreement”). You
 * may not use this file except in compliance with the Agreement, a copy
 * of which may be found at https://github.com/dunbarcyber/cyclops/. The
 * developer of the CYPHON technology and platform is Dunbar Security
 * Systems, Inc.
 *
 * The CYPHON technology or platform are distributed under the Agreement on
 * an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the Agreement for specific terms.
 *
 * Copyright (C) 2017 Dunbar Security Solutions, Inc. All Rights Reserved.
 *
 * Contributor/Change Made By: ________________. [Only apply if changes
 * are made]
 */

// Vendor
import * as React from 'react';
import { bindActionCreators as bind } from 'redux';
import { connect } from 'react-redux';

// Local
import { DispatchToProps, StateToProps } from '~/store/types';
import { SearchAlertResults } from '../components/SearchAlertResults';
import { AlertDetail } from '~/services/alerts/types';
import { InjectedRouter, LocationDescriptor } from 'react-router';
import { paginateAlertResults } from '~/store/alertSearchResults';
import { withRouter } from 'react-router';
import { SearchRouteURLQuery } from '~/routes/Search/types';

// --------------------------------------------------------------------------
// Interfaces/Types
// --------------------------------------------------------------------------

interface ContainerProps {
  router: InjectedRouter;
  location: LocationDescriptor;
}

interface ValueProps {
  page: number;
  count: number;
  results: AlertDetail[];
  router: InjectedRouter;
  location: LocationDescriptor;
}

interface FunctionProps {
  paginateResults(query: string, page: number): any;
}

type Props = ValueProps & FunctionProps;

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------

class Container extends React.Component<Props> {
  public onAlertClick = (alertID: number) => {
    this.props.router.push({ pathname: `/alerts/${alertID}/` });
  };

  public onPaginate = (page: number) => {
    if (!this.props.location.query) { return; }

    const query = (this.props.location.query as SearchRouteURLQuery).query;

    if (query) { this.props.paginateResults(query, page); }
  };

  public render() {
    return (
      <SearchAlertResults
        page={this.props.page}
        count={this.props.count}
        results={this.props.results}
        onAlertClick={this.onAlertClick}
        onPaginate={this.onPaginate}
      />
    );
  }
}

// --------------------------------------------------------------------------
// Container
// --------------------------------------------------------------------------

const values: StateToProps<ValueProps, ContainerProps> = (state, props) => ({
  page: state.alertSearchResults.page,
  count: state.alertSearchResults.count,
  results: state.alertSearchResults.results,
  router: props.router,
  location: props.location,
});

const functions: DispatchToProps<FunctionProps, ContainerProps> = (dispatch) => ({
  paginateResults: bind(paginateAlertResults, dispatch),
});

export const SearchAlertResultsContainer: React.ComponentClass<{}> = (
  withRouter(connect(values, functions)(Container))
);
