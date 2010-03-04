import Data.Char (toLower)
import Data.List

data Expression = BinaryExp Expression BinaryOperator Expression
                | UnaryExp UnaryOperator Expression
                | Literal Value
                deriving(Show, Eq)

data BinaryOperator = And | Or deriving(Show, Eq)
data UnaryOperator = Not deriving(Show, Eq)

data Value = Binary Bool | Maybe | Variable String deriving(Show, Eq)

data Tokens = Btok BinaryOperator | Utok UnaryOperator | Vtok Value | Ptok Paren deriving(Show, Eq)
data Paren = LParen | RParen deriving(Show, Eq)


tokenise :: String -> [Tokens]
tokenise input = tok (words input)
                  where
                      tok [] = []
                      tok (x:xs) = (eval x) : (tok xs)
                      eval x = case (map toLower x) of
                                    "and" -> Btok And
                                    "or" -> Btok Or
                                    "not" -> Utok Not
                                    "true" -> Vtok (Binary True)
                                    "false" -> Vtok (Binary False)
                                    "maybe" -> Vtok (Maybe)
                                    "(" -> Ptok LParen
                                    ")" -> Ptok RParen
                                    x -> Vtok (Variable x)

-- Run the shunting yard algorithm on the tokens
shuntingYard :: [Tokens] -> [Tokens]
shuntingYard toks = shunt [] [] toks
                    where
                      shunt :: [Tokens] -> [Tokens] -> [Tokens] -> [Tokens]
                      shunt output [] [] = output
                      shunt output stack [] = (reverse stack) ++ output
                      shunt output stack (x:xs) = case x of
                                                        Vtok _ -> shunt (x:output) stack xs
                                                        Btok _ -> shunt output (x:stack) xs
                                                        Utok _ -> shunt output (x:stack) xs
                                                        Ptok LParen -> shunt output (x:stack) xs
                                                        Ptok RParen -> shunt (reverse (takeWhile (not . (==) (Ptok LParen)) stack) ++ output) (tail (dropWhile (not . (==) (Ptok LParen)) stack)) xs
                                                                    
                      
-- Expects a list of reverse polish notation tokens and will return the expression that they form
parseLogic :: [Tokens] -> Maybe Expression
parseLogic toks = case toks of
                    [] -> Nothing
                    x -> Just $ parse x
                  where
                    parse [Vtok x] = Literal x
                    parse ((Utok d):ds) = UnaryExp d (parse ds)
                    --parse ((Btok
