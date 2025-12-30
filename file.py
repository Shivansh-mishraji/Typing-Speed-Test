from time import *
import random as r

def mistake(paratest,usertest):
    error = 0
    for i in range(len(paratest)):
        try:
            if paratest[i] != usertest[i]:
                error = error + 1
        except :
            error = error + 1
    return error

def speed_time (time_s,time_e,userinput):
    time_delay = time_e - time_s
    time_r = round(time_delay,2)
    speed = len(userinput)/time_r
    return round(speed)
if __name__ == "__main__":
    while True :
        ck = input(" ready to test : yes / no : ")
        if ck == "yes" :
            test = ["	Typing accurately at a high speed is not just about moving your fingers quickly, but also about maintaining focus, rhythm, and posture throughout the exercise.",
                "When practicing for a typing test, it helps to use sentences that combine common words with a few tricky ones, so your brain and hands stay equally engaged.",
                "Developing strong typing skills can improve productivity, reduce stress during deadlines, and open doors to opportunities in both academic and professional settings."]
            test1 = r.choice(test)
            print("                           ****** Typing Speed Test ******")
            print(test1)
            print()
            print()
            time_1 = time()
            test_input = input("Enter : ")
            time_2 = time()

            print(f"Speed : {speed_time(time_1,time_2,test_input)} w/sec")
            
            print(f"Error : {mistake(test1,test_input)}")
        elif ck == "no" :
            print(" Thank You ")
            break
        else :
            print("Wrong input. Try Again")


