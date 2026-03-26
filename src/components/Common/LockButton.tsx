import React, { useState } from 'react';
import { Tooltip } from '@mui/material';

interface LockButtonProps {
    isLocked: boolean;
    onToggle: () => void;
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    lockedTooltip?: string;
    unlockedTooltip?: string;
}

const sizeMap = {
    small: { w: 48, h: 24, knob: 20 },
    medium: { w: 64, h: 32, knob: 28 },
    large: { w: 96, h: 48, knob: 40 },
};

const LockButton: React.FC<LockButtonProps> = ({
                                                   isLocked,
                                                   size = 'small',
                                                   disabled = false,
                                                   lockedTooltip = 'Deactivate user',
                                                   unlockedTooltip = 'Activate user',
                                                   onToggle,
                                               }) => {
    const [animating, setAnimating] = useState(false);
    const s = sizeMap[size];

    const handleClick = () => {
        if (disabled) return;
        setAnimating(true);
        onToggle();
        setTimeout(() => setAnimating(false), 300);
    };

    return (
        <Tooltip
            title={isLocked ? lockedTooltip : unlockedTooltip}
            arrow
        >
            <label
                style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <input
                    type="checkbox"
                    checked={!isLocked}
                    onChange={handleClick}
                    style={{ display: 'none' }}
                />

                {/* Track */}
                <div
                    style={{
                        width: s.w,
                        height: s.h,
                        background: isLocked ? '#f43f5e' : '#10b981',
                        borderRadius: s.h,
                        position: 'relative',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    }}
                >
                    {/* Knob */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 2,
                            left: isLocked ? 2 : s.w - s.knob - 2,
                            width: s.knob,
                            height: s.knob,
                            background: '#fff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            transform: animating ? 'scale(0.9)' : 'scale(1)',
                        }}
                    >
                        {/* Icon */}
                        {isLocked ? (
                            <svg width="60%" viewBox="0 0 24 24">
                                <path
                                    fill="#111"
                                    d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2
                  2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3
                  8V7a3 3 0 016 0v3H9z"
                                />
                            </svg>
                        ) : (
                            <svg width="60%" viewBox="0 0 24 24">
                                <path
                                    fill="#111"
                                    d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2
                  2v9a2 2 0 002 2h12a2 2 0
                  002-2v-9a2 2 0 00-2-2h-1V6a5
                  5 0 00-5-5zm-3 8V6a3 3 0
                  116 0v3H9z"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </label>
        </Tooltip>
    );
};

export default LockButton;