# 🌙 DreamJournal

A voice-first dream recording app designed to help users develop lucid dreaming abilities and explore consciousness through astral projection techniques.

## **Core Concept**

DreamJournal solves the critical problem of **fading dream memory**. When you wake up from a vivid dream, you have seconds before the details disappear. Our app provides instant voice recording to capture dreams naturally, then uses AI transcription to build a searchable dream database for pattern recognition and lucid dreaming development.

## **Current Features**

- **Voice Recording** - One-tap dream capture with luminescent UI
- **Sacred Interface** - Dark theme with glowing blues/purples to mirror dream states
- **Tab Navigation** - Clean organization (Sacred Space, Timeline, Insights)
- **Spiritual Design** - Breathing animations and consciousness-focused UX
- **Mock Transcription** - Development-ready with realistic dream scenarios

## **Tech Stack**

- **React Native 0.79.3** with Expo Router (file-based routing)
- **expo-audio** for voice recording and playback
- **TypeScript** for type safety
- **Zustand** for state management
- **Spiritual Color Theme** - Dark backgrounds with luminescent accents

## **MVP Roadmap**

### **Phase 1: Foundation COMPLETE**
- [x] Project setup with Expo Router
- [x] Voice recording interface with sacred circle design
- [x] Spiritual color theme (dark with luminescent blues/purples)
- [x] Basic navigation structure
- [x] Mock transcription system

### **Phase 2: Real Transcription IN PROGRESS**
- [ ] Google Cloud Speech-to-Text integration
- [ ] Cloud function for audio processing
- [ ] Real-time transcription display
- [ ] Transcription accuracy indicators

### **Phase 3: Dream Analysis PLANNED**
- [ ] Dream sign detection (flying, teeth, water, etc.)
- [ ] Reality check suggestions based on content
- [ ] Pattern recognition across multiple dreams
- [ ] Lucidity scoring system

### **Phase 4: Consciousness Development PLANNED**
- [ ] Personal dream sign tracking
- [ ] Reality check reminder system
- [ ] Lucid dreaming progress metrics
- [ ] Astral projection guidance features

### **Phase 5: Advanced Features FUTURE**
- [ ] Binaural beats for deeper sleep states
- [ ] Moon phase tracking for optimal dream work
- [ ] Community features for dream sharing
- [ ] Export/backup functionality

## **Key User Flow**

1. **Wake up from dream** → Open app quickly
2. **Hit large record button** → Sacred circle starts breathing animation
3. **Speak dream naturally** → Voice recording with visual feedback
4. **Stop recording** → Automatic transcription begins
5. **Review & edit text** → Fix any transcription errors
6. **Dream analysis** → App detects patterns and suggests reality checks
7. **Build dream database** → Develop lucid dreaming over time

## 📱 **Getting Started**

### **Prerequisites**
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### **Installation**
```bash
# Clone repository
git clone [your-repo-url]
cd DreamJournal

# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

### **Required Packages**
```bash
npm install expo-audio expo-file-system zustand
```

## **Speech-to-Text Integration**

The app currently uses mock transcription for development. To enable real speech-to-text:

### **Google Cloud Setup**
1. Create Google Cloud project
2. Enable Speech-to-Text API
3. Deploy cloud function (see `/cloud-function` directory)
4. Update `CLOUD_FUNCTION_URL` in `useVoiceRecording.ts`

### **Audio Format**
- **iOS**: `.wav` format (LINEAR16, 44100Hz, mono)
- **Android**: `.m4a` format (MPEG4/AAC, 44100Hz, stereo)
- **Web**: `.webm` format (Opus codec)

## **Design Philosophy**

### **Consciousness-Focused UX**
- **Dark backgrounds** create contemplative space
- **Luminescent accents** guide attention without distraction  
- **Breathing animations** sync with natural rhythms
- **Sacred geometry** in circular recording interface
- **Minimal interactions** for drowsy morning use

### **Color Psychology**
- **Deep Space Black** (#0F0F23) - Cosmic consciousness
- **Glowing Violet** (#8B5CF6) - Third eye activation
- **Electric Blue** (#3B82F6) - Astral plane connection
- **Cyan Glow** (#06B6D4) - Higher dimensional awareness

## **Lucid Dreaming Features**

### **Pattern Recognition**
- Automatic detection of common dream signs
- Personal dream symbol tracking
- Reality check suggestions based on content

### **Consciousness Development**
- Dream clarity scoring (1-10)
- Lucidity level tracking (0-10)
- Progress metrics for awareness development

### **Reality Check System**
- "Look at your hands - count fingers"
- "Read text twice - does it change?"
- "Check digital clocks for consistency"
- Custom suggestions based on dream patterns

## **Success Metrics**

### **User Engagement**
- Dreams recorded per week
- Transcription accuracy rate
- Pattern recognition effectiveness
- Lucid dreaming achievement rate

### **Technical Performance**
- Recording startup time < 2 seconds
- Transcription completion < 30 seconds
- App crash rate < 0.1%
- Voice recording quality score

## **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## **Vision**

DreamJournal aims to be a premier tool for consciousness exploration, helping users develop from basic dream recall to advanced lucid dreaming and ultimately access astral projection. By leveraging voice technology and AI pattern recognition, we're making these ancient practices accessible to modern seekers.

---

**Ready to explore your consciousness? Start recording your dreams today.**