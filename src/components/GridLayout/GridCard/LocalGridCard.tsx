import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';

// Assets
import { BasicIcons } from '@/assets/BasicIcons';
import Audio from '@/components/common/Audio';
import { IRoleEnum } from '@/utils/types';
import useStore from '@/store/slices';
import {
  useDataMessage,
  useHuddle01,
  useLocalAudio,
  useLocalPeer,
  useRemotePeer,
} from '@huddle01/react/hooks';

const LocalGridCard: FC = () => {
  const [reaction, setReaction] = useState('');
  const isMyHandRaised = useStore((state) => state.isMyHandRaised);
  const myReaction = useStore((state) => state.myReaction);

  const { metadata, peerId: localPeerId, role, updateMetadata } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();

  useDataMessage({
    onMessage(payload, from, label) {
      if (from === localPeerId) {
        if (label === 'reaction') {
          setReaction(payload);
          setTimeout(() => {
            setReaction('');
          }, 5000);
        }
      }
    },
  });

  return (
    <div className="relative flex items-center justify-center flex-col">
      <Image
        src={metadata?.avatarUrl || '/avatar/avatar/0.png'}
        alt="default-avatar"
        width={100}
        height={100}
        quality={100}
        priority
        className="maskAvatar"
      />

      <div className="mt-1 text-center">
        <div className="text-custom-5 text-base font-medium">
          {`${metadata?.displayName} (You)`}
        </div>
        <div className="text-custom-6 text-sm font-normal">{role}</div>
      </div>
      <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 mb-2 text-4xl">
        {reaction}
      </div>
      {role && ['host, coHost, speaker'].includes(role) && (
        <div className="absolute right-0">{BasicIcons.audio}</div>
      )}
      {metadata?.isHandRaised && (
        <div className="absolute flex right-2 w-8 h-8 -top-1 rounded-full justify-center items-center bg-custom-8 text-xl border-custom-1 border-2">
          ✋
        </div>
      )}
    </div>
  );
};
export default React.memo(LocalGridCard);
