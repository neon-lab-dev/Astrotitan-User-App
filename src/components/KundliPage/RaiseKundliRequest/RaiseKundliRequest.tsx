import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Step1_RequestType from './Step1_RequestType';
import Step2_PersonalDetails from './Step2_PersonalDetails';
import Step3_BirthDetails from './Step3_BirthDetails';
import Step4_KundliType from './Step4_KundliType';
import Step5_Review from './Step5_Review';
import ProgressIndicator from './ProgressIndiator';
import { KundliFormData } from './types';
import { useSendKundliRequestMutation } from '../../../redux/features/kundliRequest/kundliRequestApi';
import AnimatedScreen from '../../layout/AnimatedScreen';
import ReusableButton from '../../reusable/ReusableButton/ReusableButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { ICONS } from '../../../assets/svg';

const RaiseKundliRequest = ({
  setActiveTab,
}: {
  setActiveTab: (tab: 'requests' | 'new') => void;
}) => {
  const [sendKundliRequest, { isLoading }] = useSendKundliRequestMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    // formState: { isValid },
  } = useForm<KundliFormData>({
    defaultValues: {
      requestType: 'generateKundli',
      userName: '',
      userEmail: '',
      userPhoneNumber: '',
      dateOfBirth: undefined as any,
      timeOfBirth: '',
      placeOfBirth: '',
      userGender: 'male',
      kundliType: 'birthChart',
      userNotes: '',
    },
    mode: 'onChange',
  });

  const formData = watch();
  const requestType = formData.requestType;

  // Determine if we're in analyze mode
  const isAnalyzeMode = requestType === 'analyzeKundli';

  // Get steps based on request type
  const getSteps = () => {
    if (isAnalyzeMode) {
      // For analyze: Step 1 (Request Type) → Step 2 (Personal Details) → Step 4 (Kundli Type) → Step 5 (Review)
      return [1, 2, 4, 5];
    }
    // For generate: All steps
    return [1, 2, 3, 4, 5];
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const currentStepIndex = steps.indexOf(currentStep);

  const handleFilePick = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 5,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled');
        } else if (response.errorCode) {
          console.log('Error:', response.errorCode);
          Alert.alert('Error', 'Failed to pick files. Please try again.');
        } else if (response.assets && response.assets.length > 0) {
          const files = response.assets.map(asset => ({
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            fileName: asset.fileName || 'file.jpg',
          }));
          setSelectedFiles(files);
        }
      },
    );
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: KundliFormData) => {
    try {
      const formData = new FormData();

      // Add fields based on request type
      const fieldsToAdd = isAnalyzeMode
        ? [
            'userName',
            'userEmail',
            'userPhoneNumber',
            'userNotes',
            'kundliType',
          ]
        : [
            'userName',
            'userEmail',
            'userPhoneNumber',
            'dateOfBirth',
            'timeOfBirth',
            'placeOfBirth',
            'userGender',
            'kundliType',
            'userNotes',
          ];

      fieldsToAdd.forEach(key => {
        const value = data[key as keyof KundliFormData];
        if (value !== undefined && value !== null) {
          if (key === 'dateOfBirth' && value instanceof Date) {
            formData.append(key, value.toISOString().split('T')[0]);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Always include requestType
      formData.append('requestType', data.requestType);

      // Add files for analyze mode
      if (isAnalyzeMode && selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
          formData.append('files', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.fileName || `file_${index}.jpg`,
          });
        });
      }

      const response = await sendKundliRequest(formData).unwrap();

      if (response.success) {
        Alert.alert(
          'Request Submitted',
          "Your kundli request has been submitted successfully. You will be notified once it's processed.",
          [{ text: 'OK', onPress: () => setActiveTab('requests') }],
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.data?.message || 'Failed to submit request. Please try again.',
      );
      console.error('Submit error:', error);
    }
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_RequestType
            requestType={formData.requestType}
            setRequestType={type => {
              setValue('requestType', type);
              // Reset to step 1 when switching types
              setCurrentStep(1);
              // Clear files when switching to generate
              if (type === 'generateKundli') {
                setSelectedFiles([]);
              }
            }}
          />
        );
      case 2:
        return <Step2_PersonalDetails control={control} />;
      case 3:
        return (
          <Step3_BirthDetails
            control={control}
            watch={watch}
            setValue={setValue}
          />
        );
      case 4:
        return (
          <Step4_KundliType
            control={control}
            watch={watch}
            setValue={setValue}
          />
        );
      case 5:
        return (
          <Step5_Review data={getValues()} selectedFiles={selectedFiles} />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.requestType;
      case 2:
        return (
          !!formData.userName &&
          !!formData.userEmail &&
          !!formData.userPhoneNumber
        );
      case 3:
        // Skip birth details validation for analyze mode
        if (isAnalyzeMode) return true;
        return (
          !!formData.dateOfBirth &&
          !!formData.timeOfBirth &&
          !!formData.placeOfBirth &&
          !!formData.userGender &&
          !!formData.userNotes
        );
      case 4:
        return !!formData.kundliType;
      case 5:
        // For analyze mode, ensure files are selected
        if (isAnalyzeMode) {
          return selectedFiles.length > 0;
        }
        return true;
      default:
        return false;
    }
  };

  const IconComponent = ICONS.UploadFile;
  const IconComponentDelete = ICONS.DeleteIcon;

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <ProgressIndicator
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Show file upload for analyze mode */}
          {isAnalyzeMode && currentStep === 2 && (
            <View style={styles.fileUploadSection}>
              <SatoshiText style={styles.fileUploadTitle}>
                Upload Kundli Files
              </SatoshiText>
              <SansText style={styles.fileUploadSubtext}>
                Please upload your existing kundli files (PDF or Images) for
                analysis
              </SansText>

              <TouchableOpacity
                style={styles.fileUploadContainer}
                onPress={handleFilePick}
              >
                <IconComponent width={28} height={28} />
                <SansText style={styles.fileUploadText}>
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file(s) selected`
                    : 'Tap to upload PDF or Images'}
                </SansText>
                <SansText style={styles.fileUploadSubtextSmall}>
                  Max 5 files, 5MB each
                </SansText>
              </TouchableOpacity>

              {selectedFiles.length > 0 && (
                <View style={styles.filesList}>
                  {selectedFiles.map((file, index) => (
                    <View key={index} style={styles.fileItem}>
                      <Icon name="document-outline" size={20} color="#D4AF37" />
                      <SansText style={styles.fileName} numberOfLines={1}>
                        {file.fileName || `File ${index + 1}`}
                      </SansText>
                      <TouchableOpacity onPress={() => removeFile(index)}>
                        <IconComponentDelete width={20} height={20} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          {currentStepIndex > 0 && (
            <ReusableButton
              title="Back"
              variant="outline"
              onPress={prevStep}
              style={styles.backButtonStyle}
            />
          )}
          <ReusableButton
            title={
              currentStepIndex === steps.length - 1 ? 'Submit Request' : 'Next'
            }
            variant="solid"
            loading={isLoading}
            onPress={
              currentStepIndex === steps.length - 1
                ? handleSubmit(onSubmit)
                : nextStep
            }
            disabled={!isStepValid()}
            style={styles.nextButton}
          />
        </View>
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: 24,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fileUploadSection: {
    marginBottom: 24,
  },
  fileUploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  fileUploadTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  fileUploadSubtext: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 12,
  },
  fileUploadContainer: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    minHeight: 100,
  },
  fileUploadText: {
    fontSize: 14,
    color: '#1a1a2e',
    marginTop: 8,
    fontFamily: 'Satoshi-Medium',
  },
  fileUploadSubtextSmall: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  filesList: {
    marginTop: 12,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
    gap: 10,
  },
  fileName: {
    flex: 1,
    fontSize: 12,
    color: '#1a1a2e',
  },
  backButtonStyle: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
});

export default RaiseKundliRequest;
