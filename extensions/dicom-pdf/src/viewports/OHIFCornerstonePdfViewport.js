import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cornerstoneTools from 'cornerstone-tools';
import cornerstone from 'cornerstone-core';
import CornerstoneViewport from 'react-cornerstone-viewport';
import OHIF, { DicomMetadataStore, utils } from '@ohif/core';
import {
  Notification,
  ViewportActionBar,
  useViewportGrid,
  useViewportDialog,
} from '@ohif/ui';
import { adapters } from 'dcmjs';
import id from '../id';

function OHIFCornerstonePdfViewport({
  children,
  dataSource,
  displaySet,
  viewportIndex,
  servicesManager,
  extensionManager,
}) {
  const {
    DisplaySetService,
    MeasurementService,
    ToolBarService,
  } = servicesManager.services;
  const { pdfUrl } = displaySet;
  const mimeType = "video/mp4";

  const url = pdfUrl;

  // Need to copies of the source to fix a firefox bug
  return (
    <div className="bg-primary-black w-full h-full">
      <object data={url} type="application/pdf" className="w-full h-full">
        <div>No online PDF viewer installed</div>
      </object>
    </div>
  )
}

export default OHIFCornerstonePdfViewport;
