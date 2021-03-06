#!/bin/bash
 
# Usage info
show_help() {
cat << EOF
  Usage: ${0##*/} [-h] [-i INFILE] [-d DURATION] [-r RATE] [-l LANGUAGE] [-k KEY]
  
  Record an utterance and send audio data to Google for speech recognition.
  
       -h|--help               display this help and exit
       -a|--auto               start stop recording automatically based on silence 
       -i|--input     INFILE   use INFILE instead of recording a stream with parecord.
       -d|--duration  FLOAT    recoding duration in seconds (Default: 3).
       -l|--language  STRING   set transcription language (Default: en_US).
                               Other languages: fr-FR, de-DE, es-ES, ...
       -r|--rate      INTEGER  Sampling rate of recorded data (Default: 48000).
                               If -i|--input is used, the sampling rate must be supplied by the user.
       -k|--key       STRING   Google Speech Recognition Key.
                  
EOF
}
 
DURATION=3
LANGUAGE=en-US
# Please replace this wih your own key
KEY=AIzaSyAbx9tR74Gh-pDTy_gsbsdt-s_pX5jK0ik


record() {
    DURATION=$1
    SRATE=$2
    INFILE=$3
    
    if hash rec 2>/dev/null; then
    # try to record audio with sox 
        rec -S -c 1 -r $SRATE $INFILE trim 0 $DURATION 
    else
    # fallback to parecord
        timeout $DURATION parecord $INFILE --file-format=flac --rate=$SRATE --channels=1
    fi
}
 
# parse parameters
while [[ $# -ge 1 ]]
do
   key="$1"
   case $key in
       -h|--help)
       show_help
       exit 0
       ;;
       -i|--input)
       INFILE="$2"
       shift
       ;;
       -d|--duration)
       DURATION="$2"
       shift
       ;;
       -r|--rate)
       SRATE=$2
       shift
       ;;
       -l|--language)
       LANGUAGE="$2"
       shift
       ;;
       -k|--key)
       KEY="$2"
       shift
       ;;
       -a|--auto)
       AUTO="$2"
       shift
       ;;
       *)
       echo "Unknown parameter '$key'. Type $0 -h for more information."
       exit 1
       ;;
   esac
   shift
done
 
if [[ ! "$DURATION" ]]
   then
     echo "ERROR: empty or invalid value for duration."
     exit 1
fi
 
if [[ ! "$LANGUAGE" ]]
   then
     echo "ERROR: empty value for language."
     exit 1
fi

 
if [[ ! "$INFILE" ]]
   then
      INFILE=record.flac
      if  [[ ! "$SRATE" ]]
         then
            SRATE=48000
      fi
      echo "Say something..."
      echo ""

      if [ -z "${AUTO+x}" ]
      then
        echo "Recording with SOX..."
        record $DURATION $SRATE $INFILE $AUTO
      else
        echo "Recording duration with silence threshold..."
        rec -S -c 1 -r $SRATE $INFILE silence 1 0 8% -1 00:00:05 8%
      fi
 
else
      if  [[ ! "$SRATE" ]]
      then
           >&2 echo "ERROR: no sampling rate specified for input file."
           exit 1
      fi
 
      echo "Try to recognize speech from file $INFILE"
      echo ""
fi
 
RESULT=`wget --post-file $INFILE --header="Content-Type: audio/x-flac; rate=$SRATE" -O - "https://www.google.com/speech-api/v2/recognize?client=chromium&lang=$LANGUAGE&key=$KEY&endpointer=1"`
 

FILTERED=`echo "$RESULT" | grep "transcript.*}" | sed 's/,/\n/g;s/[{,},"]//g;s/\[//g;s/\]//g;s/:/: /g' | grep -o -i -e "transcript.*" -e "confidence:.*"`

if [[ ! "$FILTERED" ]]
  then
     >&2 echo "Google was unable to recognize any speech in audio data"
else
    echo "Recognition result:"
    echo ""
    echo "$FILTERED"
fi

echo 
echo "CAPTURED TEXT:"
PRE_TRANSLATE=`echo -e $FILTERED | grep -i -m 1 -e "transcript:*" | sed "s/transcript: //g" | sed "s/confidence:.*$//g"`
echo $PRE_TRANSLATE
echo 
echo "----TRANSLATED-----"
echo

FRENCH=`echo $PRE_TRANSLATE | sudo trans -b :fr`
SPANISH=`echo $PRE_TRANSLATE | sudo trans -b :es`
JAPANESE=`echo $PRE_TRANSLATE | sudo trans -b :ja`
SWEDISH=`echo $PRE_TRANSLATE | sudo trans -b :sv`
PERSIAN=`echo $PRE_TRANSLATE | sudo trans -b :fa`

echo "French: $FRENCH"
echo "Spanish: $SPANISH"
echo "Japanese: $JAPANESE"
echo "Swedish: $SWEDISH"
echo "Persian: $PERSIAN"
 
exit 0
