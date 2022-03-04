import { SOPClassHandlerName, SOPClassHandlerId } from './id';
import { utils, classes } from '@ohif/core';

const { ImageSet } = classes;

const SOP_CLASS_UIDS = {
  ENCAPSULATED_PDF: '1.2.840.10008.5.1.4.1.1.104.1',
};

const sopClassUids = Object.values(SOP_CLASS_UIDS);


const _getDisplaySetsFromSeries = (instances, servicesManager, extensionManager) => {
  console.log('Called getDisplaySetsFromSeries', instances);
  const dataSource = extensionManager.getActiveDataSource()[0];
  return instances
    .map(instance => {
      const { Modality, SOPInstanceUID, EncapsulatedDocument } = instance;
      const { SeriesDescription, MIMETypeOfEncapsulatedDocument, } = instance;
      const { SeriesNumber, SeriesDate, SeriesInstanceUID, StudyInstanceUID, NumberOfFrames } = instance;
      console.log('Display PDF of type', MIMETypeOfEncapsulatedDocument, EncapsulatedDocument);
      const pdfUrl = dataSource.retrieve.directURL({ instance, tag: 'EncapsulatedDocument', defaultType: MIMETypeOfEncapsulatedDocument });
      const displaySet = {
        //plugin: id,
        Modality,
        displaySetInstanceUID: utils.guid(),
        SeriesDescription,
        SeriesNumber,
        SeriesDate,
        SOPInstanceUID,
        SeriesInstanceUID,
        StudyInstanceUID,
        SOPClassHandlerId,
        referencedImages: null,
        measurements: null,
        pdfUrl,
        others: [instance],
        thumbnailSrc: dataSource.retrieve.directURL({ instance, defaultPath: "/thumbnail", defaultType: "image/jpeg", tag: "Absent" }),
        isDerivedDisplaySet: true,
        isLoaded: false,
        sopClassUids,
        numImageFrames: NumberOfFrames,
        instance,
      };
      return displaySet;
    });
};

export default function getSopClassHandlerModule({ servicesManager, extensionManager }) {
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(
      instances,
      servicesManager,
      extensionManager
    );
  };

  console.log("Registering", SOPClassHandlerName, sopClassUids);
  return [
    {
      name: SOPClassHandlerName,
      sopClassUids,
      getDisplaySetsFromSeries,
    },
  ];
}
