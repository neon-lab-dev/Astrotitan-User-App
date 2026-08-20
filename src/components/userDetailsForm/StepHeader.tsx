// components/StepHeader.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SansText } from '../reusable/Text/SansText';

interface Props {
    step: number;
    total: number;
}

const StepHeader: React.FC<Props> = ({ step, total }) => {
    return (
        <View style={styles.container}>
            {/* <CircularProgress step={step} total={total} /> */}

            <SansText style={styles.text}>
                <SansText style={styles.bold}>Step {step + 1}</SansText> of {total}
            </SansText>
        </View>
    );
};

export default StepHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    text: {
        color:"#E2E0E0",
        fontSize: 14,
    },
    bold: {
        color:"#ffffff",
    },
});