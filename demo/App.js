import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GradientWrapper } from 'react-native-gradient-wrapper';


export default function App() {
  const [speed, setSpeed] = React.useState(4000);
  const [preset, setPreset] = React.useState<keyof typeof presets>('forest');

  const presets = {
    sunset: ['#FF512F', '#DD2476'],
    ocean: ['#1A2980', '#26D0CE'],
    forest: ['#5A3F37', '#2C7744', '#5A3F37'],
    rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
  };

  return (
    <GradientWrapper
      backgroundGradient={presets[preset]}
      backgroundRotationSpeed={speed}
      animated={true} //color rotation
      style={styles.container}
      borderWidth={0}
      angle={46.36}
    //   backgroundLocations={[0,0.5, 1]}//for background location
      borderRadius={0}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Animated Gradient</Text>
        
        <View style={styles.controls}>
          <GradientWrapper
            borderRotation='clockwise' //rotate
            borderRotationSpeed={6000} //rotation speed
            borderGradient={['rgba(0, 0, 255, 0.9)', 'rgba(186, 0, 146, 0.97)']} 
            borderRadius={30}
            stopBorderAfter={300000}//stop after 30 sec
            borderAngle={46.38}// insted of start and end X,Y you can use angle
            borderWidth={2}
            contentStyle={styles.button}//inner content style
            style={{margin: 0}}
            enableFeedback
            backgroundGradient={['rgb(155, 70, 0)', 'rgb(50, 0, 56)']}
            backgroundLocations={[0, 0.6,1]}
          >
            <TouchableOpacity 
              onPress={() => setSpeed(prev => Math.max(1000, prev - 500))}
            >
              <Text style={{color:'#FFFFFF'}}>Faster</Text>
            </TouchableOpacity>
          </GradientWrapper>
          
          <Text style={styles.speedText}>{speed}ms</Text>
          
          <TouchableOpacity 
            style={[styles.button, {backgroundColor:"#fff", borderRadius:30}]}
            onPress={() => setSpeed(prev => prev + 500)}
          >
            <Text>Slower</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.presetContainer}>
          {Object.keys(presets).map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.presetButton, preset === key && styles.activePreset]}
              onPress={() => setPreset(key)}
            >
              <Text style={styles.presetText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </GradientWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    height: 35,
    width: 100,
    alignItems:'center',
    alignContent:'center',
    flex:1,
  },
  speedText: {
    color: 'white',
    fontSize: 16,
    minWidth: 80,
    textAlign: 'center',
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  presetButton: {
    padding: 10,
    margin: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  activePreset: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  presetText: {
    color: 'white',
  },
});