import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { fetchGroupName } from '../../helpers/group/group-helper';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

const ExpandableContent = ({ isOpen, row }) => {
  const [ groupNames, setGroupNames ] = useState([]);
  const [ isLoaded, setIsLoaded ] = useState(true);
  const [ expanded ] = useState(isOpen);

  const fetchGroupNames = () => {
    return Promise.all(row.group_refs.map((ref) => fetchGroupName(ref)));
  };

  useEffect(() => {
    row && fetchGroupNames(row.group_refs).then((data) => { setGroupNames(data); setIsLoaded(true); }).catch(() => setIsLoaded(true));
  }, [ expanded ]);

  return (
    <Fragment>
      <TextContent>
        <Text className="data-table-detail heading" component={ TextVariants.small }>Description</Text>
        <Text className="data-table-detail content" component={ TextVariants.h5 }>{ row.description }</Text>
      </TextContent>
      <TextContent>
        <Fragment>
          <Text className="data-table-detail heading" component={ TextVariants.small }>Groups</Text>
          { isLoaded ?
            <Text className="data-table-detail content"
              component={ TextVariants.h5 }>
              { groupNames.join(',') }
            </Text> :
            <div>
              <Skeleton size={ SkeletonSize.sm } />
            </div> }
        </Fragment>
      </TextContent>
    </Fragment>
  );};

ExpandableContent.defaultProps = {
  groupNames: []
};

ExpandableContent.propTypes = {
  description: PropTypes.string,
  row: PropTypes.object,
  isOpen: PropTypes.bool
};

export default ExpandableContent;

