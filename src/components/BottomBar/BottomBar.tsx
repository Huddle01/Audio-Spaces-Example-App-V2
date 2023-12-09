'use client';

import React, { useEffect, useState } from 'react';
import useStore from '@/store/slices';
import Strip from '../Sidebar/Peers/PeerRole/Strip';

// Assets
import { BasicIcons, NestedBasicIcons } from '@/assets/BasicIcons';
import { cn } from '@/utils/helpers';
import Dropdown from '../common/Dropdown';
import EmojiTray from '../EmojiTray/EmojiTray';
import { useRouter } from 'next/navigation';
import {
  useLocalPeer,
  useLocalAudio,
  usePeerIds,
  useRoom,
} from '@huddle01/react/hooks';
import toast from 'react-hot-toast';

type BottomBarProps = {};

const BottomBar: React.FC<BottomBarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { peerIds } = usePeerIds();

  const { push } = useRouter();

  const { leaveRoom, closeRoom } = useRoom();

  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio({
    onProduceStart(producer) {
      toast.success('Producer created');
      console.debug('Producer created', producer);
    },
  });

  const sidebarView = useStore((state) => state.sidebar.sidebarView);

  const isChatOpen = useStore((state) => state.isChatOpen);
  const setIsChatOpen = useStore((state) => state.setIsChatOpen);

  const setSidebarView = useStore((state) => state.setSidebarView);

  const setPromptView = useStore((state) => state.setPromptView);

  const { role, metadata, updateRole, peerId: localPeerId } = useLocalPeer();

  const [showLeaveDropDown, setShowLeaveDropDown] = useState<boolean>(false);

  return (
    <div className="absolute bottom-6 w-full flex items-center px-10 justify-between">
      {/* Bottom Bar Left */}
      <div>
        {role === 'host' || role === 'coHost' || role === 'speaker' ? (
          <div className="mr-auto flex items-center justify-between gap-3 w-44"></div>
        ) : (
          <OutlineButton
            className="mr-auto flex items-center justify-between gap-3"
            onClick={() => setPromptView('request-to-speak')}
          >
            {BasicIcons.requestToSpeak}
            <div>Request to speak</div>
          </OutlineButton>
        )}
      </div>

      {/* Bottom Bar Center */}
      <div className="flex items-center gap-4">
        {role !== 'listener' &&
          (!isAudioOn ? (
            <button
              onClick={() => {
                enableAudio();
              }}
            >
              {NestedBasicIcons.inactive.mic}
            </button>
          ) : (
            <button
              onClick={() => {
                disableAudio();
              }}
            >
              {NestedBasicIcons.active.mic}
            </button>
          ))}
        <Dropdown
          triggerChild={BasicIcons.avatar}
          open={isOpen}
          onOpenChange={() => setIsOpen((prev) => !prev)}
        >
          <EmojiTray
            onClick={() => alert('todo')}
            onClose={() => setIsOpen(false)}
          />
        </Dropdown>
        <Dropdown
          triggerChild={BasicIcons.leave}
          open={showLeaveDropDown}
          onOpenChange={() => setShowLeaveDropDown((prev) => !prev)}
        >
          {role === 'host' && (
            <Strip
              type="close"
              title="End spaces for all"
              variant="danger"
              onClick={() => {
                closeRoom();
              }}
            />
          )}
          <Strip
            type="leave"
            title="Leave the spaces"
            variant="danger"
            onClick={() => {
              leaveRoom();
            }}
          />
        </Dropdown>
      </div>
      <div className="flex items-center gap-4">
        {/* Bottom Bar Right */}

        <OutlineButton
          className="ml-auto flex items-center gap-3"
          onClick={() => {
            setSidebarView(sidebarView === 'peers' ? 'close' : 'peers');
            if (isChatOpen) {
              setIsChatOpen(false);
            }
          }}
        >
          {BasicIcons.peers}
          <span>
            {Object.keys(peerIds).filter((peerId) => peerId !== localPeerId)
              .length + 1}
          </span>
        </OutlineButton>
        <OutlineButton
          className="ml-auto flex items-center gap-3"
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (sidebarView !== 'close') {
              setSidebarView('close');
            }
          }}
        >
          {BasicIcons.chat}
        </OutlineButton>
      </div>
    </div>
  );
};
export default React.memo(BottomBar);

interface OutlineButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  className,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={cn('border border-custom-4 rounded-lg py-2 px-3', className)}
  >
    {children}
  </button>
);
