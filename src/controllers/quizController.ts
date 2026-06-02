import { NextFunction, Request, Response } from "express";
import QuizTracking from "../models/quizTrackingSchema";
import { ApiError } from "../utils/ApiError";

export const getLandingPageData = async (req: Request, res: Response) => {
    try {
        const existingData = await QuizTracking.findOne();

        if (!existingData) {
            await QuizTracking.create({});
            console.log("Quiz tracking document created.");
        }

        const quizData = await QuizTracking.findOne();
        res.status(200).json({
            status: 'success',
            message: 'Landing page data retrieved successfully.',
            data: quizData
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
}

export const getTopThreeHighestScores = async (req: Request, res: Response) => {

}

export const updateHighestScore = async (req: Request, res: Response) => {
    const { quizName } = req.params;
    const { score } = req.body;
    if (!quizName) {
        throw new ApiError(400, 'Quiz name is required.');
    }
    if (!score) {
        throw new ApiError(400, 'Score is required.');
    }

    const quiz = await QuizTracking.findOne();
    if (!quiz) {
        throw new ApiError(404, 'Quiz not found.');
    }

    const previousTopThreeScores = quiz.get(`${quizName}TopThreeScores`) || { first: 0, second: 0, third: 0 };

    let newTopThreeScores = previousTopThreeScores;
    if (score > previousTopThreeScores.first) {
        newTopThreeScores.third = previousTopThreeScores.second;
        newTopThreeScores.second = previousTopThreeScores.first;
        newTopThreeScores.first = score;
    } else if (score > previousTopThreeScores.second) {
        newTopThreeScores.third = previousTopThreeScores.second;
        newTopThreeScores.second = score;
    } else if (score > previousTopThreeScores.third) {
        newTopThreeScores.third = score;
    }

    const fieldName = `${quizName}TopThreeScores`;

    const data = await QuizTracking.findOneAndUpdate(
        {},
        { $set: { [fieldName]: newTopThreeScores } },
        { new: true }
    );

    res.status(200).json({
        status: 'success',
        message: 'Scores updated successfully.',
    });

}


export const updateTotalPlayCount = async (req: Request, res: Response) => {
    const { quizName } = req.params;
    if (!quizName) {
        throw new ApiError(400, 'Quiz name is required.');
    }

    let convertedName = '';
    for(let i=0;i<quizName.length;i++){
        if(i===0){
            convertedName += quizName[i].toUpperCase();
        }else{
            convertedName += quizName[i];
        }
    }
    const quizNameField = `total${convertedName}GamePlayed`;

    await QuizTracking.findOneAndUpdate(
        {},
        { $inc: { [quizNameField]: 1 } },
        { new: true }
    );
    res.status(200).json({
        status: 'success',
        message: 'Total play count updated successfully.',
    });
}

