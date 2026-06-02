import { Router } from 'express';
import { getLandingPageData, getTopThreeHighestScores, updateHighestScore, updateTotalPlayCount } from '../controllers/quizController';
const router = Router();

router.get('/getLandingPageData', getLandingPageData)
router.get('/getTopThreeHighestScores/:quizName', getTopThreeHighestScores)
router.post('/updateHighestScore/:quizName', updateHighestScore)
router.post('/updateTotalPlayCount/:quizName', updateTotalPlayCount)

export default router;
