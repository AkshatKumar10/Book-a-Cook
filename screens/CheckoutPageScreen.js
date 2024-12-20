// // CheckoutPageScreen.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Button,
//   Image,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import RazorpayCheckout from "react-native-razorpay";

// export default function CheckoutPageScreen({ route }) {
//   const navigation = useNavigation();
//   const {
//     mealType,
//     guestCount,
//     address,
//     selectedDate,
//     selectedTime,
//     selectedCuisine,
//     cookName,
//     totalAmount, // Assuming totalAmount is passed from the previous screen
//   } = route.params;

//   // const [paymentSuccess, setPaymentSuccess] = useState(false);
//   // if (!RazorpayCheckout) {
//   //   console.error("RazorpayCheckout module is not loaded correctly.");
//   //   return;
//   // }

//   const handlePayment = () => {
//     const options = {
//       description: "Sample Payment",
//       image: "https://i.imgur.com/3g7nmJC.jpg",
//       currency: "INR",
//       key: "rzp_test_t86tDGCZODCoNY",
//       amount: totalAmount * 100,
//       name: "Acme Corp",
//       // order_id: "order_PR6aC0aEHXlBPJ", //Replace this with an order_id created using Orders API.
//       prefill: {
//         email: "user@example.com",
//         contact: "9023415172",
//         name: "JOhn",
//       },
//       theme: { color: "#53a20e" },
//     };
//     console.log("Payment options: ", options);
//     console.log("Opening Razorpay Checkout...");
//     RazorpayCheckout.open(options)
//       .then((data) => {
//         console.log("Payment successful: ", data);
//         Alert.alert(`Success: ${data.razorpay_payment_id}`);
//       })
//       .catch((error) => {
//         console.error("Payment error: ", error);
//         Alert.alert(`Error: ${error.code} | ${error.description}`);
//       });
//   };
//   //   RazorpayCheckout.open({
//   //     description: "Test payment",
//   //     image: "https://i.imgur.com/3g7nmJC.jpg",
//   //     currency: "INR",
//   //     key: "", // Replace with your actual API key
//   //     amount: 100, // Amount in paise
//   //     name: "Test Merchant",
//   //     prefill: {
//   //       email: "test@example.com",
//   //       contact: "9999999999",
//   //       name: "Test User",
//   //     },
//   //     theme: { color: "#53a20e" },
//   //   })
//   //     .then((data) => {
//   //       console.log(`Payment successful: ${data.razorpay_payment_id}`);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error in payment: ", error);
//   //     });
//   // };

//   return (
//     <View style={styles.container}>
//       <View style={styles.detailsContainer}>
//         <Text style={styles.title}>Meal Details</Text>
//         <Text style={styles.detailText}>
//           Meal Type: <Text style={styles.boldText}>{mealType}</Text>
//         </Text>
//         <Text style={styles.detailText}>
//           Number of Guests: <Text style={styles.boldText}>{guestCount}</Text>
//         </Text>
//         <Text style={styles.detailText}>
//           Address: <Text style={styles.boldText}>{address}</Text>
//         </Text>
//         <Text style={styles.detailText}>
//           Date: <Text style={styles.boldText}>{selectedDate}</Text>
//         </Text>
//         <Text style={styles.detailText}>
//           Time: <Text style={styles.boldText}>{selectedTime}</Text>
//         </Text>
//         <Text style={styles.detailText}>
//           Cuisine: <Text style={styles.boldText}>{selectedCuisine}</Text>
//         </Text>
//         <Text style={styles.detailText}>
//           Cook: <Text style={styles.boldText}>{cookName}</Text>
//         </Text>
//       </View>
//       <View style={styles.amountContainer}>
//         <Text style={styles.amountTitle}>Total Amount</Text>
//         <Text style={styles.amountText}>₹{totalAmount.toFixed(2)}</Text>
//         {/* Display the total amount */}
//       </View>
//       {/* {paymentSuccess ? ( */}
//       {/* <View style={styles.paymentContainer}>
//         <Image
//           source={{
//             uri: "https://maigha.com/wp-content/uploads/2023/10/Untitled_design-2-removebg-preview.png",
//           }}
//           style={styles.image}
//         />
//         <Text style={styles.description}>Thank you for your purchase!</Text>
//         <Text style={styles.amount}>Amount: ₹{totalAmount.toFixed(2)} INR</Text>

//       </View> */}
//       {/* ) : ( */}
//       <View style={styles.buttonContainer}>
//         <Button title="Pay Now" onPress={handlePayment} color="#09518e" />
//       </View>
//       {/* )} */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     padding: 16,
//   },
//   detailsContainer: {
//     backgroundColor: "#f3f4f6",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     textAlign: "center",
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: 18,
//     marginBottom: 4,
//   },
//   boldText: {
//     fontWeight: "500",
//   },
//   amountContainer: {
//     backgroundColor: "#fffbeb",
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   amountTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   amountText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#4caf50",
//   },
//   paymentContainer: {
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   image: {
//     width: 150,
//     height: 100,
//     resizeMode: "cover",
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   amount: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";

export default function CheckoutPageScreen({ route }) {
  const [showWebView, setShowWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    mealType,
    guestCount,
    address,
    selectedDate,
    selectedTime,
    selectedCuisine,
    cookName,
    totalAmount,
  } = route.params;

  const razorpayHTML = `
    <html>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script>
          window.onload = function() {
            var options = {
              key: "rzp_test_t86tDGCZODCoNY",
              amount: ${totalAmount * 100}, // Amount in paise
              currency: "INR",
              name: "Book A Cook",
              description: "Meal Payment",
              image: "https://i.imgur.com/3g7nmJC.jpg",
              handler: function(response) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ event: "SUCCESS", response })
                );
              },
              prefill: {
                name: "John",
                email: "user@example.com",
                contact: "9023415172",
              },
              theme: {
                color: "#53a20e",
              },
              modal: {
                ondismiss: function() {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ event: "DISMISS" })
                  );
                },
              },
            };
            var rzp = new Razorpay(options);
            rzp.open();
          };
        </script>
      </head>
      <body style="background-color:#f2f2f2;">
        <h3 style="text-align:center; margin-top:50px;">
          Redirecting to payment...
        </h3>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.event === "SUCCESS") {
      Alert.alert(
        "Payment Successful",
        `Payment ID: ${data.response.razorpay_payment_id}`
      );
      setShowWebView(false);
    } else if (data.event === "DISMISS") {
      Alert.alert(
        "Payment Cancelled",
        "The payment was dismissed by the user."
      );
      setShowWebView(false);
    }
  };

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowWebView(true);
    }, 500);
  };

  if (showWebView) {
    return (
      <WebView
        originWhitelist={["*"]}
        source={{ html: razorpayHTML }}
        onMessage={handleWebViewMessage}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#53a20e" />
      ) : (
        <>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>Meal Details</Text>
            <Text style={styles.detailText}>
              Meal Type: <Text style={styles.boldText}>{mealType}</Text>
            </Text>
            <Text style={styles.detailText}>
              Number of Guests:{" "}
              <Text style={styles.boldText}>{guestCount}</Text>
            </Text>
            <Text style={styles.detailText}>
              Address: <Text style={styles.boldText}>{address}</Text>
            </Text>
            <Text style={styles.detailText}>
              Date: <Text style={styles.boldText}>{selectedDate}</Text>
            </Text>
            <Text style={styles.detailText}>
              Time: <Text style={styles.boldText}>{selectedTime}</Text>
            </Text>
            <Text style={styles.detailText}>
              Cuisine: <Text style={styles.boldText}>{selectedCuisine}</Text>
            </Text>
            <Text style={styles.detailText}>
              Cook: <Text style={styles.boldText}>{cookName}</Text>
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountTitle}>Total Amount</Text>
            <Text style={styles.amountText}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Pay Now" onPress={handlePayment} color="#09518e" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  detailsContainer: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "500",
  },
  amountContainer: {
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  amountTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  amountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4caf50",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
});
