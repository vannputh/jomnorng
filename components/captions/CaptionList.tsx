"use client";

import React, { useRef, useEffect } from "react";
import type { Language, VibeOption } from "@/lib/types";
import EmptyState from "./EmptyState";
import SelectionStage from "./SelectionStage";
import EditingStage from "./EditingStage";
import ImprovingStage from "./ImprovingStage";
import DoneStage from "./DoneStage";
import DefaultCaptionView from "./DefaultCaptionView";

interface CaptionListProps {
    captions: string[];
    selectedCaption: string;
    setSelectedCaption: (caption: string) => void;
    selectedVibeOption: VibeOption | undefined;
    language: Language;
    onRefresh: () => void;
    onCopy: (text: string) => void;
    isGenerating: boolean;
    workflowStage?: "initial" | "selecting" | "editing" | "improving" | "done";
    onSelectFavorite?: (caption: string) => void;
    selectedFavorite?: string;
    finalCaption?: string;
    setFinalCaption?: (caption: string) => void;
    onAIImprove?: (customMessage?: string) => void;
    isImproving?: boolean;
    onDone?: () => void;
    improvedCaptions?: string[];
    onSelectImprovedCaption?: (caption: string) => void;
    onBackFromImproving?: () => void;
    editHeaderRef?: React.RefObject<HTMLDivElement | null>;
}

export default function CaptionList({
    captions,
    selectedCaption,
    setSelectedCaption,
    selectedVibeOption,
    language,
    onRefresh,
    onCopy,
    isGenerating,
    workflowStage = "initial",
    onSelectFavorite,
    selectedFavorite,
    finalCaption,
    setFinalCaption,
    onAIImprove,
    isImproving,
    onDone,
    improvedCaptions = [],
    onSelectImprovedCaption,
    onBackFromImproving,
    editHeaderRef,
}: CaptionListProps) {
    // Create refs for each stage header
    const emptyHeaderRef = useRef<HTMLDivElement | null>(null);
    const defaultHeaderRef = useRef<HTMLDivElement | null>(null);
    const selectionHeaderRef = useRef<HTMLDivElement | null>(null);
    const improvingHeaderRef = useRef<HTMLDivElement | null>(null);
    const doneHeaderRef = useRef<HTMLDivElement | null>(null);

    // Scroll to header when workflow stage changes
    useEffect(() => {
        const scrollToHeader = () => {
            let targetRef: React.RefObject<HTMLDivElement | null> | null = null;

            switch (workflowStage) {
                case "initial":
                    targetRef = captions.length === 0 ? emptyHeaderRef : defaultHeaderRef;
                    break;
                case "selecting":
                    targetRef = selectionHeaderRef;
                    break;
                case "editing":
                    targetRef = editHeaderRef || null;
                    break;
                case "improving":
                    targetRef = improvingHeaderRef;
                    break;
                case "done":
                    targetRef = doneHeaderRef;
                    break;
            }

            if (targetRef?.current) {
                targetRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        };

        // Small delay to ensure the component has rendered
        const timeoutId = setTimeout(scrollToHeader, 100);
        return () => clearTimeout(timeoutId);
    }, [workflowStage, captions.length, editHeaderRef]);

    // Empty state - when no captions are available
    if (captions.length === 0) {
        return <EmptyState language={language} headerRef={emptyHeaderRef} />;
    }

    // Selection Stage - Choose favorite from 3 options
    if (workflowStage === "selecting") {
        return (
            <SelectionStage
                captions={captions}
                selectedFavorite={selectedFavorite}
                language={language}
                onSelectFavorite={onSelectFavorite}
                headerRef={selectionHeaderRef}
            />
        );
    }

    // Editing Stage - Edit or improve the selected caption
    if (workflowStage === "editing") {
        return (
            <EditingStage
                finalCaption={finalCaption}
                setFinalCaption={setFinalCaption}
                onAIImprove={onAIImprove}
                isImproving={isImproving}
                onDone={onDone}
                onCopy={onCopy}
                language={language}
                editHeaderRef={editHeaderRef}
            />
        );
    }

    // Improving Stage - Show improved caption with simple actions
    if (workflowStage === "improving") {
        return (
            <ImprovingStage
                improvedCaptions={improvedCaptions}
                finalCaption={finalCaption}
                setFinalCaption={setFinalCaption}
                onBackFromImproving={onBackFromImproving}
                onDone={onDone}
                onCopy={onCopy}
                language={language}
                headerRef={improvingHeaderRef}
            />
        );
    }

    // Done Stage - Show success
    if (workflowStage === "done") {
        return (
            <DoneStage
                finalCaption={finalCaption}
                onCopy={onCopy}
                language={language}
                headerRef={doneHeaderRef}
            />
        );
    }

    // Default view - showing generated captions
    return (
        <DefaultCaptionView
            captions={captions}
            selectedCaption={selectedCaption}
            setSelectedCaption={setSelectedCaption}
            selectedVibeOption={selectedVibeOption}
            language={language}
            onRefresh={onRefresh}
            onCopy={onCopy}
            isGenerating={isGenerating}
            headerRef={defaultHeaderRef}
        />
    );
}
